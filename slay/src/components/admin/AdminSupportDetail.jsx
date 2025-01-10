import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import AdminService from "../../service/AdminService";
import FileService from "../../service/FileService";
import SupportService from "../../service/SupportService";
import MessageSupportItem from "./MessageSupportItem";
import {useAuthStore} from "../store/store";

const AdminSupportDetail = () => {
    const [support, setSupport] = useState([]);
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const params = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const navigate = useNavigate();
    const authStore = useAuthStore()

    useEffect(() => {
        const fetchSupportDetail = async () => {
            try {
                const response = await AdminService.getSupportDetailById(params?.supportId)
                setSupport(response);
                setMessages(response.messages || []); // Инициализация сообщений
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };
        console.log(messages)
        console.log(111)
        //
        fetchSupportDetail();
    }, [params.supportId]);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe(`/topic/support/${params.supportId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => stompClient.deactivate();
    }, []);

    const uploadFiles = async () => {
        const formData = new FormData();

        uploadedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await axios.post(
                "http://localhost:8080/api/files/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            return [];
        }
    };

    const sendMessage = async (data) => {
        const imageUrls = await uploadFiles();

        if (!client) {
            console.error("WebSocket клиент не подключен");
            return;
        }

        const newMessage = {
            message: data.message,
            sender: {
                username: authStore?.userData?.username,
                avatar: authStore?.userData?.avatar,
            },
            createAt: new Date().toISOString(),
            supportRequestId: params.supportId,
            images: imageUrls,
        };

        // Отправляем сообщение через WebSocket
        client.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(newMessage),
        });

        // Убираем локальное добавление сообщения, чтобы оно добавлялось только через WebSocket
        reset();
        setUploadedFiles([]);
    };




    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const deleteSupport = async () => {
        if (window.confirm("Вы уверены, что хотите удалить этот запрос?")) {
            await SupportService.deleteSupport(params.supportId)
            navigate("/admin/support");
            window.location.reload();
        }
    };

    const changeSupportResolvedStatus = async() => {
        if (window.confirm("Вы уверены, что хотите закрыть/открыть запрос?")) {
            await SupportService.changeResolvedStatusSupport(params.supportId)
            navigate("/admin/support");
            window.location.reload();
        }
    };

    return (
        <div className="support-chat-container">
            <ul className="support-detail-info">
                <li>
                    <h2 className="support-detail-title">Тема</h2>
                    <span>{support.subject}</span>
                </li>
                <li>
                    <h2 className="support-detail-title">Тип запроса</h2>
                    <span className="support-detail-span">{support.requestType}</span>
                </li>
                <li>
                    <h2 className="support-detail-title">Создан</h2>
                    <span>
                        {support.createAt
                            ? format(new Date(support.createAt), "dd-MM-yyyy")
                            : "Дата недоступна"}
                    </span>
                </li>
                <li>
                    <h2 className="support-detail-title">Статус</h2>
                    {support.resolved ? <span>Закрыт</span> : <span>Открыт</span>}
                </li>
            </ul>
            <div className="support-chat-form-container">
                <div className="support-chat-block">
                    {messages.map((message, index) => (
                        <MessageSupportItem message={message} index={index} />
                    ))}
                </div>
                <form onSubmit={handleSubmit(sendMessage)}>
                    <textarea
                        className="support-message-textarea"
                        name="message"
                        required
                        placeholder="Введите сообщение"
                        {...register("message")}
                    />
                    <div className="file-upload-wrapper">
                        <div className="file-upload-block">
                            <label htmlFor="images" className="file-upload-label">
                                <img
                                    src="/icons8-image-100.png"
                                    alt="Загрузить изображение"
                                    className="file-upload-icon"
                                />
                                <p>Перетащите файлы сюда или нажмите</p>
                            </label>
                            <input
                                id="images"
                                type="file"
                                name="images"
                                className="file-upload-input"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="uploaded-files-list">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="uploaded-file-item">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="file-thumbnail"
                                />
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    {uploadProgress[file.name] && (
                                        <progress value={uploadProgress[file.name]} max="100"/>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="remove-file-button"
                                    onClick={() => removeFile(index)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="support-btn-block">
                        <button className="support-btn">Отправить</button>
                    </div>
                </form>
            </div>
            <div className="support-panel">
                <a onClick={deleteSupport}>
                    <button className="btn delete-btn">Удалить</button>
                </a>
                <a onClick={changeSupportResolvedStatus}>
                        {
                            support.resolved ?
                                <button className="btn close-btn">Открыть запрос</button>
                            : <button className="btn close-btn">Закрыть запрос</button>
                        }
                </a>
          {/*      <a href="#">
                    <button className="btn resolve-btn">Решить запрос</button>
                </a>*/}
            </div>
        </div>
    );
};

export default AdminSupportDetail;
