import React, { useState } from 'react';

import TrainingCourseService from "../../service/TrainingCourseService";
import StarRating from './StarRating';

const ReviewModalContent = ({
                                handleSubmit,
                                register,
                                trainingCourseId,
                                errors,
                                reset
                            }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [requestResultText, setRequestResultText] = useState('');
    const [rating, setRating] = useState(0);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const reviewBody = {
                title: data.title,
                text: data.text,
                rating: rating,
            };
            formData.append(
                'reviewFields',
                new Blob([JSON.stringify(reviewBody)], { type: 'application/json' })
            );

            formData.append(
                'trainingCourseId',
                new Blob([JSON.stringify(trainingCourseId)], { type: 'application/json' })
            );
            if (uploadedFiles.length > 0) {
                uploadedFiles.forEach((file) => {
                    formData.append("images", file);
                });
            } else formData.append("images", []);

            await TrainingCourseService.createCourseReview(formData, setUploadProgress, setUploadedFiles, reset, setRequestResultText);

            setRequestResultText(
                'Review has been successfully sent, you can close the window!'
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
            <label htmlFor="title" className="support-label">
                title
                <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <input
                type="text"
                className="simple-input"
                name="title"
                {...register('title',
                    {
                        required: 'Title is required',
                        minLength: {
                            value: 2,
                            message: 'Title must be more than 2 characters',
                        },
                        maxLength: {
                            value: 200,
                            message: 'Title must be no more than 100 characters',
                        },
                    }
                )}
            />
            {errors.title?.message && (
                <span className="error-message">*{errors?.title.message}</span>
            )}
            <label htmlFor="text" className="support-label">
                text
                <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <textarea
                {...register('text', {
                    maxLength: {
                        value: 1000,
                        message: 'Text must be no more than 1000 characters'
                    }
                })}
                className="support-area"
                name="text"
            />
            {errors.text?.message && (
                <span className="error-message">*{errors?.text.message}</span>
            )}

            <div className="input-simple-wrapper">
                <label className="support-label">
                    Rating
                </label>
                <StarRating onChange={(value) => setRating(value)} />
            </div>
            {errors.rating?.message && (
                <span className="error-message">*{errors?.rating.message}</span>
            )}

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
                        {...register('images', {
                            validate: {
                                validFormat: (files) => {
                                    if (!files || files.length === 0) return true;
                                    const file = files[0];
                                    const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', "image/webp", "video/mp4", "video/*"];
                                    return acceptedFormats.includes(file.type) || 'Unsupported image format';
                                },
                            }
                        })}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            {errors.images?.message && (
                <span className="error-message">*{errors?.images.message}</span>
            )}

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

            <div className="modal-footer">
                <div className="support-btn-block">
                    <button className="green-center-btn">Send</button>
                </div>
            </div>
        </form>
    );
};

export default ReviewModalContent;