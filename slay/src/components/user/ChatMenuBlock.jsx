import React from 'react';
import {Link, NavLink} from "react-router-dom";
import {useAuthStore} from "../store/store";

const ChatMenuBlock = ({chats}) => {
    const authStore = useAuthStore()
    return (
        <div className="chat-menu-block">
            {
                chats?.map((chat) => (
                    <NavLink to={`/message/${chat.id}`}>
                        {chat?.members
                            .filter((member) => member?.username !== authStore?.userData?.username)
                            .map((member) => (
                                <div className="chat-block">
                                    <img src={member?.avatar ? member?.avatar : "/defaultAvatar.jpg"}
                                         className="chat-member-avatar" alt=""/>
                                    <div>
                                        <span className="chat-members-username">{member?.username}</span>
                                        <span className="chat-last-message">{member?.username === authStore?.userData?.username
                                            ? `${member?.username}: ${chat.lastMessage.slice(0, 20)}`
                                            :  `You: ${chat.lastMessage.slice(0, 20)}`

                                        }</span>
                                    </div>
                                </div>
                            ))}
                    </NavLink>

                ))

            }

        </div>
    );
};

export default ChatMenuBlock;