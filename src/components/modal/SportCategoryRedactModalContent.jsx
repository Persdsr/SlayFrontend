import React, { useEffect, useState } from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";
import AdminService from "../../service/AdminService";

const SportCategoryRedactModalContent = ({
                                             category,
                                             reset,
                                             register,
                                             errors,
                                             watch,
                                             setValue,
                                             handleSubmit
                                         }) => {
    const [requestResultText, setRequestResultText] = useState('');
    const [posterPreview, setPosterPreview] = useState(category?.poster || null);

    useEffect(() => {
        setValue('poster', category?.poster || null);
        setPosterPreview(category?.poster || null);
    }, [setValue, category]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const categoryFields = {
                name: data.name,
                description: data.description
            };
            formData.append(
                'categoryFields',
                new Blob([JSON.stringify(categoryFields)], { type: 'application/json' })
            );


                formData.append("poster", data.poster);

            await AdminService.updateSportCategoryFields(formData, category.name);

            window.location.reload()
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
                name
                <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <input
                type="text"
                className="simple-input"
                name="name"
                defaultValue={category.name}
                {...register('name',
                    {
                        required: 'Name is required',
                        minLength: {
                            value: 3,
                            message: 'Name must be more than 3 characters',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Name must be no more than 20 characters',
                        },
                    }
                )}
            />
            {errors.name?.message && (
                <span className="error-message">*{errors?.name.message}</span>
            )}
            <label htmlFor="text" className="support-label">
                description
                <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <textarea
                defaultValue={category.description}
                {...register('description', {
                    maxLength: {
                        value: 1000,
                        message: 'Description must be no more than 1000 characters'
                    }
                })}
                className="support-area"
                name="text"
            />
            {errors.description?.message && (
                <span className="error-message">*{errors?.description.message}</span>
            )}

            <label htmlFor="title" className="support-label">
                poster
                <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>

            <div className="file-input-wrapper">
                <label className="file-input-label">
                    <input
                        type="file"
                        {...register('poster', {
                            required: {
                                value: false,
                                message: "Poster is required",
                            },
                            validate: {
                                validFormat: (files) => {
                                    const existingPoster = watch('poster');
                                    if (existingPoster) return true;

                                    if (!files || files.length === 0) return true;

                                    const file = files[0];
                                    const acceptedFormats = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                                    return acceptedFormats.includes(file.type) || 'Unsupported image format';
                                },
                            },
                        })}
                        className="file-input"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setValue('poster', file);
                                const objectUrl = URL.createObjectURL(file);
                                setPosterPreview(objectUrl);
                            }
                        }}
                    />
                    {posterPreview ? (
                        <img
                            style={{ width: '220px', height: '300px' }}
                            src={posterPreview}
                            alt="Poster Preview"
                        />
                    ) : (
                        <span className="placeholder">Choose a file or drag it here</span>
                    )}
                </label>
            </div>

            {errors.poster?.message && (
                <span className="error-message">*{errors?.poster.message}</span>
            )}

            <div className="modal-footer">
                <div className="support-btn-block">
                    <button className="green-center-btn">Save</button>
                </div>
            </div>
        </form>
    );
};

export default SportCategoryRedactModalContent;