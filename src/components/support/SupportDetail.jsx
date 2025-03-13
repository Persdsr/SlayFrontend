import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import SupportService from '../../service/SupportService';
import MessageSupportItem from './MessageSupportItem';
import { useAuthStore } from '../store/store';

const SupportDetail = () => {
  const [support, setSupport] = useState([]);
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const params = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const navigate = useNavigate();
  const authStore = useAuthStore();

  useEffect(() => {
    const fetchSupportDetail = async () => {
      try {
        const response = await SupportService.getSupportDetailById(
          params?.supportId
        );
        setSupport(response);
        setMessages(response.messages || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchSupportDetail();
  }, [params.supportId]);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(
          `/topic/support/${params.supportId}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }

        );
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

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
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      return [];
    }
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
        username: authStore.userData.username,
        avatar: authStore?.userData?.avatar,
      },
      supportRequestId: params.supportId,
      images: filesUrls,
    };

    client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(newMessage),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
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

  const deleteSupport = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот запрос?')) {
      await SupportService.deleteSupport(params.supportId);
      navigate('/admin/support');
      window.location.reload();
    }
  };

  const changeSupportResolvedStatus = async () => {
    if (window.confirm('Вы уверены, что хотите закрыть/открыть запрос?')) {
      await SupportService.changeResolvedStatusSupport(params.supportId);
      navigate('/admin/support');
      window.location.reload();
    }
  };

  return (
    <div className="support-chat-container">
      <ul className="support-detail-info">
        <li>
          <h2 className="support-detail-title">Topic</h2>
          <span>{support.subject}</span>
        </li>
        <li>
          <h2 className="support-detail-title">Request type</h2>
          <span className="support-detail-span">{support.requestType}</span>
        </li>
        <li>
          <h2 className="support-detail-title">Created</h2>
          <span>
            {support.createAt
              ? format(new Date(support.createAt), 'dd-MM-yyyy')
              : '-'}
          </span>
        </li>
        <li>
          <h2 className="support-detail-title">Status</h2>
          {support.resolved ? <span>Close</span> : <span>Open</span>}
        </li>
      </ul>
      <div className="support-chat-form-container">
        <div className="support-chat-block">
          {messages.map((message, index) => (
            <MessageSupportItem message={message} key={index} />
          ))}
        </div>
        {!support.resolved ? (
          <form onSubmit={handleSubmit(sendMessage)}>
            <textarea
              className="support-message-textarea"
              name="message"
              required
              placeholder="Enter message.."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(sendMessage)(e);
                }
              }}
              {...register('message')}
            />
            <div className="file-upload-wrapper">
              <div className="file-upload-block">
                <label htmlFor="images" className="file-upload-label">
                  <img
                    src="/icons8-white-image-100.png"
                    alt="Загрузить изображение"
                    className="file-upload-icon"
                  />
                  <p>Drag and drop the files here or click</p>
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
                      <progress value={uploadProgress[file.name]} max="100" />
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
              <button className="green-center-btn">Send</button>
            </div>
          </form>
        ) : (
          <h2 style={{ color: 'white' }}>Topic already is closed</h2>
        )}
      </div>
      {authStore?.userData?.roles.includes('ADMIN', 'MODERATOR') ? (
        <div className="support-panel">
          <a onClick={deleteSupport}>
            <button className="btn delete-btn">Delete</button>
          </a>
          <a onClick={changeSupportResolvedStatus}>
            {support.resolved ? (
              <button className="btn close-btn">Open request</button>
            ) : (
              <button className="btn close-btn">Close request</button>
            )}
          </a>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SupportDetail;
