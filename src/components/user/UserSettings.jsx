import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { useForm } from 'react-hook-form';
import UserService from '../../service/UserService';
import UserLeftToolbar from '../navbar/UserLeftToolbar';
import LoadingPageIndicator from '../LoadingPageIndicator';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import {HttpStatusCode} from "axios";

const UserSettings = () => {
  const authStore = useAuthStore();
  const { register, handleSubmit, setValue, reset, watch, formState: {
    errors: errors
  } } = useForm();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData) => {
    const birthday = formData.birthday ? `${formData.birthday}T00:00:00.000` : null;

    const body = {
      name: formData.name,
      aboutMe: formData.aboutMe,
      birthday: birthday,
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
    if (response.status === HttpStatusCode.NoContent) {
      window.location.reload();
    }
  };


  useEffect(() => {
    setIsLoading(true);
    if (!authStore.userData?.username) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await UserService.getUserProfileData(authStore.userData.username);
        setData(response.data);
        setValue('name', response.data.name || '');
        setValue('aboutMe', response.data.aboutMe || '');
        setValue('banner', response.data.banner || '');

        if (response.data.birthday) {
          const birthdayDate = new Date(response.data.birthday);
          const formattedDate = birthdayDate.toISOString().split('T')[0];
          setValue('birthday', formattedDate);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setValue, authStore?.userData?.username]);

  return (
      <div className="content-container">
        <UserLeftToolbar authStore={authStore} />
        <div className="settings-block">
          {isLoading ? (
              <LoadingMiniIndicator />
          ) : (
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
                          validate: {
                            validFormat: (files) => {
                              const existingAvatar = watch('avatar');
                              if (existingAvatar) return true;

                              if (!files || files.length === 0) return true;

                              const file = files[0];
                              const acceptedFormats = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                              return acceptedFormats.includes(file.type) || 'Unsupported image format';
                            },
                          },
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
                    {errors.avatar?.message && (
                        <span className="error-message">*{errors?.avatar.message}</span>
                    )}
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
                        {...register('banner', {validate: {
                            validFormat: (files) => {
                              const existingBanner = watch('banner');
                              if (existingBanner) return true;

                              if (!files || files.length === 0) return true;

                              const file = files[0];
                              const acceptedFormats = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                              return acceptedFormats.includes(file.type) || 'Unsupported image format';
                            },
                          },
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

                {errors.baner?.message && (
                    <span className="error-message">*{errors?.baner.message}</span>
                )}

                <div className="form-group-simple">
                  <label>Name</label>
                  <input type="text" required={true} {...register('name', {
                    minLength: {
                      value: 2,
                      message: "The name must contain from 2 to 70 characters"
                    },
                    maxLength: {
                      value: 70,
                      message: "The name must contain from 2 to 70 characters"
                    }
                  })} />
                </div>

                {errors.name?.message && (
                    <span className="error-message">*{errors?.name.message}</span>
                )}

                <div className="form-group-simple">
                  <label>About Me</label>
                  <textarea className="simple-textarea" {...register('aboutMe', {
                    maxLength: {
                      value: 1000,
                      message: 'Max length - 1000'
                    }
                  })} />
                </div>

                {errors.aboutMe?.message && (
                    <span className="error-message">*{errors?.aboutMe.message}</span>
                )}

                <div className="form-group-simple">
                  <label>Birthday</label>
                  <input
                      type="date"
                      {...register('birthday', {
                        validate: (value) => {
                          if (!value) return true;
                          const selectedDate = new Date(value);
                          const currentDate = new Date();
                          return selectedDate <= currentDate || "The birthday can't be in the future";
                        },
                      })}
                  />
                  {errors.birthday && (
                      <span className="error-message">{errors.birthday.message}</span>
                  )}
                </div>

                <div className="form-actions-modern">
                  <button type="submit" className="save-button-setting">
                    Save
                  </button>
                  <button
                      onClick={() => window.location.reload()}
                      type="button"
                      className="cancel-button-modern"
                  >
                    Cancel
                  </button>
                </div>
              </form>
          )}
        </div>
      </div>
  );
};

export default UserSettings;