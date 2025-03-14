import React, {useEffect, useState} from 'react';

import {useAuthStore} from '../store/store';

import UserLeftToolbar from '../navbar/UserLeftToolbar';
import {Controller, useForm} from 'react-hook-form';
import {Link, useNavigate, useParams} from 'react-router-dom';
import ChatService from '../../service/ChatService';
import ChatMenuBlock from './ChatMenuBlock';
import {TextareaAutosize} from '@mui/material';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import VideoPlayer from '../player/VideoPlayer';
import {format} from 'date-fns';
import FileService from '../../service/FileService';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import LoadingPageIndicator from "../LoadingPageIndicator";

const ChatDetail = () => {
    const [chats, setChats] = useState([]);
    const [chatDetail, setChatDetail] = useState([]);
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const {register, control, handleSubmit, reset} = useForm();
    const params = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const authStore = useAuthStore();
    const [isChatDetailLoading, setIsChatDetailLoading] = useState(false)

    useEffect(() => {
        const fetchChatsAndChatDetail = async () => {

            if (!authStore?.userData?.username) {
                return;
            }

            try {
                const response = await ChatService.getChats(authStore?.userData?.username);
                setChats(response.data);

                const responseChatDetail = await ChatService.getChatDetailById(params.chatId);
                setChatDetail(responseChatDetail);
                setMessages(responseChatDetail.messages || []);
            } catch (error) {
                console.error('Error fetching chat detail:', error);
            }
        };

        if (params.chatId) {
            fetchChatsAndChatDetail();
        }
    }, [params.chatId, authStore?.userData?.username]);

    useEffect(() => {
        setIsChatDetailLoading(true)
        const connectToWebsocket = async () => {
            try {
                const stompClient = new Client({
                    webSocketFactory: () =>
                        new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
                    onConnect: () => {
                        console.log('Connected to WebSocket');

                        const subscription = stompClient.subscribe(
                            `/topic/chat/${params.chatId}`,
                            (message) => {
                                const newMessage = JSON.parse(message.body);
                                setMessages((prevMessages) => [...prevMessages, newMessage]);
                            }
                        );

                        return () => {
                            subscription.unsubscribe();
                        };
                    },
                });

                stompClient.activate();
                setClient(stompClient);

                return () => stompClient.deactivate();
            } catch (e) {
                console.log("Error connect to WebSocket")
            } finally {
                setIsChatDetailLoading(false)
            }
        }
        if (params.chatId) {
            connectToWebsocket();
        }
    }, [params.chatId]);


    const uploadFiles = async () => {
        const formData = new FormData();

        uploadedFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/files/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return [];
        }
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage('');
    };

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setShowImageModal(true);
    };

    const sendMessage = async (data) => {
        let filesUrls = [];
        if (uploadedFiles.length > 0) {
            filesUrls = await uploadFiles();
        }

        if (!client) {
            console.error('WebSocket клиент не подключен');
            return;
        }

        const newMessage = {
            message: data.message,
            sender: {
                username: authStore?.userData?.username,
                avatar: authStore?.userData?.avatar,
            },
            chatId: params.chatId,
            files: filesUrls,
        };

        client.publish({
            destination: '/app/chat.sendUserMessage',
            body: JSON.stringify(newMessage)
        });

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

    return (
        <div className="content-container">
            <UserLeftToolbar/>

            <div className="content-block">
                <div className="chats-container">
                    <div className="chats-menu">
                        <ChatMenuBlock chats={chats}/>
                    </div>
                    <div className="chat-content">
                        {
                            isChatDetailLoading ? (
                                <LoadingPageIndicator/>
                            ) : (
                                <div className="chat-messages-block">
                                    <div>
                                        {messages.map((message, index) => (
                                            <div key={index} className="message-block">
                                                <img
                                                    className="message-avatar"
                                                    src={message?.sender?.avatar || '/defaultAvatar.jpg'}
                                                    alt="Avatar"
                                                />
                                                <div className="message-info">
                      <span className="message-sender-username">
                        {message.sender.username}
                      </span>
                                                    <span className="message-text">{message.message}</span>
                                                    {message.files.map((file, index) =>
                                                        FileService.getFileType(file) === 'video' ? (
                                                            <VideoPlayer
                                                                key={index}
                                                                videoUrl={file.replace('download', 'view')}
                                                            />
                                                        ) : (
                                                            <img
                                                                key={index}
                                                                className="message-image"
                                                                src={file}
                                                                onClick={() => openImageModal(file)}
                                                                alt=""
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <span className="message-createdAt">
                      {message?.createdAt
                          ? format(
                              new Date(message.createdAt),
                              'HH:mm yyyy-MM-dd'
                          )
                          : format(new Date().toISOString(), 'HH:mm yyyy-MM-dd')}
                    </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        <div className="input-message-block">
                            <form
                                style={{width: '100%', display: 'flex', alignItems: 'center'}}
                                onSubmit={handleSubmit(sendMessage)}
                            >
                                <label htmlFor="files" className="file-upload-icon-wrapper">
                                    <img
                                        src="/add-file.png"
                                        alt="Загрузить файлы"
                                        className="file-upload-icon"
                                        style={{cursor: 'pointer'}}
                                    />
                                </label>
                                <input
                                    id="files"
                                    type="file"
                                    name="files"
                                    className="file-upload-input-hidden"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <Controller
                                    name="message"
                                    control={control}
                                    defaultValue=""
                                    render={({field}) => (
                                        <div style={{position: 'relative', flex: 1}}>
                                            <TextareaAutosize
                                                {...field}
                                                className="message-input"
                                                placeholder="Enter message.."
                                                {...register('message')}
                                                minRows={1}
                                                maxRows={6}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSubmit(sendMessage)(e);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                className="send-message-button"
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: '10px',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <img
                                                    src="/send.png"
                                                    alt="Отправить"
                                                    style={{width: '28px', height: '25px'}}
                                                />
                                            </button>
                                        </div>
                                    )}
                                />
                            </form>
                        </div>
                        <div className="uploaded-files-list">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="uploaded-file-item">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="file-thumbnail"
                                    />
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
                    </div>
                </div>
            </div>
            {showImageModal && (
                <div className="review-modal-overlay" onClick={closeImageModal}>
                    <div className="image-modal-content">
                        <img src={selectedImage} alt="Selected Review"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatDetail;
