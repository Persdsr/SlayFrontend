import React from 'react';
import {format} from "date-fns";

const MessageSupportItem = ({message, index}) => {
    return (
        <div key={index} className="support-chat-message">
            <div className="support-message-sender-info">
                <img src="/maxresdefault.png" alt=""/>
                <div>
                    <span className="support-message-author">
                        {message.sender || "Unknown"}
                    </span>
                    <span className="support-message-sender-createAt">
                        {message.createAt
                            ? format(new Date(message.createAt), "dd.MM.yyyy")
                            : "Неизвестно"}
                    </span>
                </div>
            </div>
            <span className="support-sender-message-text">
                {message.message}
            </span>

            {/* Если есть изображения, то отображаем их */}
            {message.images && message.images.length > 0 && (
                <div className="support-message-images">
                    {message.images.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt={`message image ${index}`}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageSupportItem;