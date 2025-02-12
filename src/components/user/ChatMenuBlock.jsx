import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import LoadingMiniIndicator from "../LoadingMiniIndicator";

const ChatMenuBlock = ({ chats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);
  const authStore = useAuthStore();
  const [isChatsLoading, setIsChatLoading] = useState(false)

  useEffect(() => {
    setIsChatLoading(false)
    try {
      if (!searchTerm.trim()) {
        setFilteredChats(chats);
      } else {
        const filtered = chats.filter((chat) =>
            chat.members.some((member) =>
                member.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredChats(filtered);
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsChatLoading(true)
    }
  }, [searchTerm, chats]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="chat-menu-block">
      <div className="search-chats-block">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
          className="search-users-input"
        />
      </div>
      {
        isChatsLoading ? (
            <LoadingMiniIndicator />
        ) : (
            <div>
              {filteredChats !== undefined && filteredChats?.length > 0
                  ? filteredChats.map((chat) => (
                      <NavLink to={`/message/${chat.id}`} key={chat.id}>
                        {chat.members
                            .filter(
                                (member) => member?.username !== authStore?.userData?.username
                            )
                            .map((member) => (
                                <div className="chat-block" key={member.username}>
                                  <img
                                      src={
                                        member?.avatar ? member?.avatar : '/defaultAvatar.jpg'
                                      }
                                      className="chat-member-avatar"
                                      alt=""
                                  />
                                  <div>
                      <span className="chat-members-username">
                        {member?.username}
                      </span>
                                    <span className="chat-last-message">
                        {chat.lastMessage
                            ? member?.username === authStore?.userData?.username
                                ? `${member?.username}: ${chat?.lastMessage?.slice(0, 20)}`
                                : `You: ${chat?.lastMessage?.slice(0, 20)}`
                            : ''}
                      </span>
                                  </div>
                                </div>
                            ))}
                      </NavLink>
                  ))
                  : ''}
            </div>
        )
      }

    </div>
  );
};

export default ChatMenuBlock;
