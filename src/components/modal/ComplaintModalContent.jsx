import React, {useState} from 'react';
import ComplaintCourseService from "../../service/ComplaintCourseService";

const ComplaintModalContent = ({
                                   handleSubmit,
                                   register,
                                    params,
                                    senderUsername,
                                    reset,
                                   complaintTypesMap,
                               }) => {

    const [requestResultText, setRequestResultText] = useState('');

    const onSubmit = async (data) => {
        const complaintBody = {
            senderUsername: senderUsername,
            reportedCourse: params.id,
            courseComplaintType: data.complaintRequestType,
            description: data.description,
        };

        try {
            const response =
                await ComplaintCourseService.createComplaintCourse(complaintBody);
            setRequestResultText(
                'Сomplaint has been successfully sent, you can close the window!'
            );
            reset();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {requestResultText && (
                <div className="request-result-block">
                    <span className="request-result-text">{requestResultText}</span>
                </div>
            )}
            <div className="input-simple-wrapper">
                <label htmlFor="requestType" className="support-label">
                    Report type<span style={{color: 'red'}}>*</span>
                </label>
                <select
                    name="requestType"
                    className="simple-input"
                    {...register('complaintRequestType')}
                >
                    <option value="" disabled selected>
                        Pick support type
                    </option>
                    {Object.entries(complaintTypesMap).map(([value, label]) => (
                        <option value={value}>{label}</option>
                    ))}
                </select>
            </div>
            <label htmlFor="description" className="support-label">
                Description
                <span style={{color: 'red', marginBottom: '5px'}}>*</span>
            </label>
            <textarea
                {...register('description')}
                className="support-area"
                name="description"
            />
            <div className="modal-footer">
                <div className="support-btn-block">
                    <button className="green-center-btn">Send</button>
                </div>
            </div>
        </form>
    );
};

export default ComplaintModalContent;