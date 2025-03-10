import React from 'react';
import ComplaintCourseService from "../../service/ComplaintCourseService";

const MessageModalContent = ({
                                 handleSubmit,
                                 register,
                                 navigate,
                                 authorUsername
                             }) => {

    const onSubmit = async (data) => {
        const messageBody = {
            message: data.message,
            receiver: authorUsername,
        };

        try {
            const responseChatId =
                await ComplaintCourseService.createChatAndFirstMessage(messageBody);
            navigate(`/message/${responseChatId}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="description" className="support-label">
                message
                <span style={{color: 'red', marginBottom: '5px'}}>*</span>
            </label>
            <textarea
                {...register('message')}
                className="support-area"
                name="message"
            />
            <div className="modal-footer">
                <div className="support-btn-block">
                    <button className="green-center-btn">Send</button>
                </div>
            </div>
        </form>
    );
};

export default MessageModalContent;