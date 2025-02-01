import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SupportService from '../../service/SupportService';
import { useAuthStore } from '../store/store';

const CreateSupport = () => {
  const { register, handleSubmit, reset } = useForm();
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
      senderUsername: authStore?.userData?.username,
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
              {...register('email')}
            />
          </div>

          <div className="input-simple-wrapper">
            <label htmlFor="requestType" className="support-label">
              Support type<span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="requestType"
              className="simple-input"
              {...register('requestType')}
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

          <div className="input-simple-wrapper">
            <label htmlFor="subject" className="support-label">
              Topic<span style={{ color: 'red', marginBottom: '5px' }}>*</span>
            </label>
            <input
              type="text"
              className="simple-input"
              name="subject"
              {...register('subject')}
            />
          </div>
          <label htmlFor="description" className="support-label">
            Description<span style={{ color: 'red', marginBottom: '5px' }}>*</span>
          </label>
          <textarea
            {...register('description')}
            className="support-area"
            name="description"
          />

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
                {...register('images')}
                onChange={handleFileChange}
              />
            </div>
          </div>

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
            <button className="support-btn">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupport;
