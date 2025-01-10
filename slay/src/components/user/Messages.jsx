import React, {useEffect, useState} from 'react';

import {useAuthStore} from "../store/store";

import UserLeftToolbar from "../navbar/UserLeftToolbar";
import {useForm} from "react-hook-form";
import {Link, useNavigate, useParams} from "react-router-dom";
import AdminService from "../../service/AdminService";
import ChatService from "../../service/ChatService";
import ChatMenuBlock from "./ChatMenuBlock";

const MyPurchaseCourses = () => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const params = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const navigate = useNavigate();
    const authStore = useAuthStore()


    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await ChatService.getChats()
                setChats(response);
                setMessages(response.messages || []); // Инициализация сообщений
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [authStore?.userData?.username]);

    return (
        <div className="content-container">

            <UserLeftToolbar />

            <div className="content-block">
                <div className="chats-container">
                    <div className="chats-menu">
                        <div className="search-chats-block">
                            <input type="text"/>
                        </div>
                        <ChatMenuBlock chats={chats}/>
                    </div>
                    <div className="chat-content">
                        <h2>Выберите чат для общения</h2>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default MyPurchaseCourses;