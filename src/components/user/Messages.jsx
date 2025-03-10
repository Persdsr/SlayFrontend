import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import UserLeftToolbar from '../navbar/UserLeftToolbar';
import ChatMenuBlock from './ChatMenuBlock';
import ChatService from '../../service/ChatService';

const Messages = () => {
  const [chats, setChats] = useState([]);
  const authStore = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChatService.getChats();
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
            <ChatMenuBlock chats={chats} />
          </div>
          <div className="chat-content">
            <h2>Select a chat for communication</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
