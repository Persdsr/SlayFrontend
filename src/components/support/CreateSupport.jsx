import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SupportService from '../../service/SupportService';
import { useAuthStore } from '../store/store';

const CreateSupport = () => {
  const { register, handleSubmit, reset, formState: {
    errors
  } } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [requestResultText, setRequestResultText] = useState('');

  const [supportTypes, setSupportTypes] = useState([]);
  const authStore = useAuthStore();

  useEffect(() => {
    const fetchRequestTypes = async () => {
      const response = await SupportService.getSupportRequestTypes();
      setSupportTypes(response);
    };
    fetchRequestTypes();
  }, []);

  const onSubmit = (data) => {
    const formData = new FormData();

    const supportBody = {
      email: data.email,
      senderUsername: authStore?.authenticated
          ? authStore?.userData?.username
          : null,
      requestType: data.requestType,
      subject: data.subject,
      description: data.description,
    };

    formData.append(
      'supportBody',
      new Blob([JSON.stringify(supportBody)], { type: 'application/json' })
    );

    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    SupportService.sendSupport(
        formData,
        setUploadProgress,
        setUploadedFiles,
        reset,
        setRequestResultText
    ) .then(r => (
        console.log(r)
    ));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="main-center-title">SUPPORT</h1>

      <div className="main-center-container">
        {requestResultText && (
          <div className="request-result-block">
            <span className="request-result-text">{requestResultText}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="input-simple-wrapper">
            <label htmlFor="email" className="support-label">
              email
              <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <input
              type="email"
              className="simple-input"
              name="email"
              {...register('email',
                  {
                    required: 'Email is required',
                    maxLength: {
                      value: 100,
                      message: 'Email must be no more than 100 characters',
                    },
                  }
              )}
            />
          </div>
          {errors.email?.message && (
              <span className="error-message">*{errors?.email.message}</span>
          )}

          <div className="input-simple-wrapper">
            <label htmlFor="requestType" className="support-label">
              Support type<span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="requestType"
              className="simple-input"
              {...register('requestType', {
                required: "Request type is required"
              })}
            >
              <option value="" disabled selected>
                Select support type
              </option>
              {supportTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {errors.requestType?.message && (
              <span className="error-message">*{errors?.requestType.message}</span>
          )}

          <div className="input-simple-wrapper">
            <label htmlFor="subject" className="support-label">
              Subject<span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <input
              type="text"
              className="simple-input"
              name="subject"
              {...register('subject',
                  {
                    required: 'Subject is required',
                    maxLength: {
                      value: 300,
                      message: 'Subject must be no more than 300 characters',
                    },
                  }
              )}
            />
          </div>
          {errors.subject?.message && (
              <span className="error-message">*{errors?.subject.message}</span>
          )}
          <br/>

          <label htmlFor="description" className="support-label">
            Description<span style={{ color: 'red', marginBottom: '5px' }}>*</span>
          </label>
          <textarea
            {...register('description',
                {
                  required: 'Description is required',
                  minLength: {
                    value: 1,
                    message: 'Description must be at least 3 characters',
                  },
                  maxLength: {
                    value: 5000,
                    message: 'Description must be no more than 100 characters',
                  },
                }
            )}
            className="support-area"
            name="description"
          />
          {errors.description?.message && (
              <span className="error-message">*{errors?.description.message}</span>
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
                {...register('images' ,{
                  validate: {
                    validFormat: (files) => {
                      if (!files || files.length === 0) return true;
                      const file = files[0];
                      const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', "image/webp"];
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

          <div className="support-btn-block">
            <button className="green-center-btn">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupport;
