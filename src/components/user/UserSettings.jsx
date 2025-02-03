import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { useForm } from 'react-hook-form';
import UserService from '../../service/UserService';
import UserLeftToolbar from '../navbar/UserLeftToolbar';
import LoadingPageIndicator from '../LoadingPageIndicator';

const UserSettings = () => {
  const authStore = useAuthStore();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const onSubmit = async (formData) => {
    const body = {
      name: formData.name,
      aboutMe: formData.aboutMe,
    };
    const form = new FormData();
    form.append(
      'body',
      new Blob([JSON.stringify(body)], { type: 'application/json' })
    );
    form.append(
      'avatar',
      formData.avatar.length > 0 ? formData.avatar[0] : data.avatar
    );
    form.append(
      'banner',
      formData.banner.length > 0 ? formData.banner[0] : data.banner
    );

    const response = await UserService.updateUserData(form);
    if (response.status === 200) {
      window.location.reload();
    }
  };

  const cancelSetting = () => {
    window.location.reload();
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await UserService.getUserProfileData();
        setData(response.data);
        setValue('name', response.data.name || '');
        setValue('aboutMe', response.data.aboutMe || '');
        setValue('banner', response.data.banner || '');
      };
      fetchData();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  if (loading) {
    return <LoadingPageIndicator />;
  }

  return (
    <div className="content-container">
      <UserLeftToolbar authStore={authStore} />

      <div className="profile-block">
        <form onSubmit={handleSubmit(onSubmit)} className="modern-form">
          <div className="profile-photo-block-modern">
            <h2>Avatar</h2>
            <label className="avatar-wrapper">
              <img
                src={data.avatar || '/defaultAvatar.jpg'}
                alt="Profile Avatar"
                className="profile-avatar-settings"
              />
              <div className="overlay">
                <span className="icon">📷</span>
              </div>
              <input
                type="file"
                id="avatar-input"
                className="avatar-input"
                {...register('avatar', {
                  onChange: (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setData({
                        ...data,
                        avatar: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  },
                })}
              />
            </label>
            <h2>Banner</h2>
            <label className="banner-wrapper">
              <img
                src={data.banner ? data.banner : '/white-background.jpeg'}
                alt="Profile banner"
                className="profile-banner-settings"
              />
              <div className="banner-overlay">
                <span className="icon">📷</span>
              </div>
              <input
                type="file"
                id="banner-input"
                className="banner-input"
                {...register('banner', {
                  onChange: (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setData({
                        ...data,
                        banner: URL.createObjectURL(
                          e.target.files[0]
                            ? e.target.files[0]
                            : '/white-background.jpeg'
                        ),
                      });
                    }
                  },
                })}
              />
            </label>
          </div>

          <div className="form-group-simple">
            <label>name</label>
            <input type="text" required={true} {...register('name')} />
          </div>

          <div className="form-group-simple">
            <label>about me</label>
            <textarea className="simple-textarea" {...register('aboutMe')} />
          </div>

          <div className="form-actions-modern">
            <button type="submit" className="save-button-setting">
              Save
            </button>
            <button
              onClick={cancelSetting}
              type="button"
              className="cancel-button-modern"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
