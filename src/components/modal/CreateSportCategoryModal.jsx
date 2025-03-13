import React, {useState} from 'react';
import AdminService from "../../service/AdminService";
import {useForm} from "react-hook-form";
import {HttpStatusCode} from "axios";


const CreateSportCategoryModal = () => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();

        const categoryFields = {
            name: data.name,
            description: data.description,
        };
        formData.append(
            'categoryFields',
            new Blob([JSON.stringify(categoryFields)], { type: 'application/json' })
        );
        formData.append(
            'poster',
            data.poster.length > 0 ? data.poster[0] : data.poster
        );

        const response = await AdminService.createSportCategory(formData)
        if (response.status === HttpStatusCode.Created) {
            window.location.reload();
        } else {

        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="title" className="support-label">
                name
                <span style={{color: 'red', marginBottom: '5px'}}>*</span>
            </label>
            <input
                type="text"
                className="simple-input"
                name="name"
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
            <label className="support-label">
                description
            </label>
            <textarea
                {...register('description', {
                    required: true,
                    maxLength: {
                        value: 1000,
                        message: 'Description must be no more than 1000 characters'
                    }
                })}
                className="support-area"
                name="description"
            />
            {errors.description?.message && (
                <span className="error-message">*{errors?.description.message}</span>
            )}

            <label htmlFor="title" className="support-label">
                poster
                <span style={{color: 'red', marginBottom: '5px'}}>*</span>
            </label>

            <div className="file-input-wrapper">
                <label className="file-input-label">
                    <input
                        type="file"
                        {...register('poster',
                            {
                                required: "Poster is required",
                                validate: {
                                    validFormat: (files) => {
                                        if (!files || files.length === 0) return true;
                                        const file = files[0];
                                        const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', "image/webp"];
                                        return acceptedFormats.includes(file.type) || 'Unsupported image format';
                                    },
                                },
                            })}
                        className="file-input"
                    />
                    {watch('poster')?.[0] ? (
                        <img
                            src={URL.createObjectURL(watch('poster')[0])}
                            alt="Uploaded Poster"
                            style={{ width: '220px', height: '300px' }}
                        />
                    ) : (
                        <span className="placeholder">
                      Choose a file or drag it here
                    </span>
                    )}
                </label>
            </div>

            {errors.poster?.message && (
                <span className="error-message">*{errors?.poster.message}</span>
            )}

            <div className="modal-footer">
                <div className="support-btn-block">
                    <button className="green-center-btn">CREATE</button>
                </div>
            </div>
        </form>
    );
};

export default CreateSportCategoryModal;