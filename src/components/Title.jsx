import React, { useState } from 'react';
import Modal from './Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { setAuthTokens } from './user/fetcher';

const Title = () => {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      const errorMessage = document.getElementById('error-message');
      errorMessage.classList.remove('hidden');
      setErrorMessage('Passwords do not match');
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`,
      data
    );
    if (response.data.success === false) {
      const errorMessage = document.getElementById('error-message');
      errorMessage.classList.remove('hidden');
      setErrorMessage(response.data.message);
    } else {
      setRegisterOpen(false);
      setLoginOpen(true);
    }
  };

  const onSubmitLogin = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signin`, data)
      .then((response) => {
        console.log('Успех:', response);
        setAuthTokens(response.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response.data.message);
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.remove('hidden');
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="title-block">
      <div className="title-info-block">
        <div className="title-block-content">
          <h1 className="title-block-text">
            <span className="title-block-slay">SLAY</span> THE BEST GYM PRACTICE
            COURSES
          </h1>
          <span className="title-block-description">
            Alquam vismmil nvnm fili, aw congue masssa pretm ul in vel jusi ops
          </span>
          <div className="title-buttons">
            <button
              className="title-block-button"
              onClick={() => setRegisterOpen(true)}
            >
              Регистрация
            </button>
            <button
              className="title-block-button"
              onClick={() => setLoginOpen(true)}
            >
              Войти
            </button>
          </div>
        </div>
      </div>

      <div className="title-poster-block">
        <img src="/logo-man.png" alt="" className="title-poster" />
      </div>

      <div className="title-detail-block">
        <ul>
          <li className="title-detail-text">
            <img src="/gym100.png" alt="Icon 1" className="list-icon" />
            Create your own courses or learn from your coaches – all in one place!
          </li>
          <li className="title-detail-text">
            <img src="/ganteli.png" alt="Icon 2" className="list-icon" />
            Choose from hundreds of courses and communicate directly with the trainers – your progress is in your hands!
          </li>
          <li className="title-detail-text">
            <img src="/icon-motivation.png" alt="Icon 3" className="list-icon" />
            Training videos that motivate, and courses that work – start changing today!
          </li>
        </ul>
      </div>

      <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
        <div className="modal-block">
          <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
            <div id="error-message" className="card-error hidden">
              <svg
                className="error-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p>{errorMessage}</p>
            </div>
            <div className="modal-column">
              {errors.username && (
                <span className="error-message">*{errors.username}</span>
              )}

              <div className="input-simple-wrapper">
                <input
                  type="text"
                  className="input-box"
                  placeholder="username"
                  name="username"
                  {...register('username')}
                />
                <span className="underline"></span>
              </div>
              <span id="input-username-hint" className="input-hint">
                The username must not contain special characters (_+#/, etc.)
              </span>

              {errors.email && (
                <span className="error-message">*{errors.email}</span>
              )}
              <div className="input-wrapper">
                <input
                  type="email"
                  className="input-box"
                  placeholder="email"
                  name="email"
                  {...register('email')}
                />
                <span className="underline"></span>
              </div>

              <div className="input-simple-wrapper">
                <input
                  type="text"
                  className="input-box"
                  placeholder="name"
                  name="name"
                  {...register('name')}
                />
                <span className="underline"></span>
              </div>

              {errors.password && (
                <span className="error-message">*{errors.password}</span>
              )}
              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-box"
                  placeholder="password"
                  name="password"
                  {...register('password')}
                />
                <span className="underline"></span>
              </div>

              <span id="input-password-hint" className="input-hint">
                The password must start with a capital letter and have from 8 to
                32 characters.
              </span>

              {errors.confirmPassword && (
                <span className="error-message">*{errors.confirmPassword}</span>
              )}
              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-box"
                  placeholder="confirmPassword"
                  name="confirmPassword"
                  {...register('confirmPassword')}
                />
                <span className="underline"></span>
              </div>
            </div>
            <div className="auth-choise">
              <span className="auth-choise-text">
                Есть аккаунт?{' '}
                <span
                  style={{ color: '#23c483', cursor: 'pointer' }}
                  onClick={() => (setRegisterOpen(false), setLoginOpen(true))}
                >
                  Войти
                </span>
              </span>
            </div>
            <button type="submit" className="modal-btn-confirm">
              Зарегистрироваться
            </button>
          </form>

          <div className="modal-info">
            <div className="modal-poster">
              <img
                src="/maxresdefault.png"
                alt=""
                className="modal-poster-img"
              />
            </div>
            <ul>
              <li className="modal-detail-text">
                <img
                  src="/"
                  alt="Icon 1"
                  className="list-icon"
                />
                Your personal trainer and a library of training videos are all in one place!
              </li>
              <li className="modal-detail-text">
                <img src="/slay.png" alt="Icon 2" className="list-icon" />
                Sports, Health and Development – start with the right course and training videos now!
              </li>
              <li className="modal-detail-text">
                <img src="/dnevnikvideo.png" alt="Icon 3" className="list-icon" />
                Create, learn, be inspired – watch training videos and reach new heights with us!
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <div className="modal-block">
          <form className="modal-form" onSubmit={handleSubmit(onSubmitLogin)}>
            <div id="error-message" className="card-error hidden">
              <svg
                className="error-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p>{errorMessage}</p>
            </div>
            <div className="modal-column">
              {errors.username && (
                <span className="error-message">*{errors.username}</span>
              )}

              <div className="input-wrapper">
                <input
                  type="username"
                  className="input-box"
                  placeholder="Имя пользователя"
                  name="email"
                  {...register('username')}
                />
                <span className="underline"></span>
              </div>

              {errors.password && (
                <span className="error-message">*{errors.password}</span>
              )}

              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-box"
                  placeholder="Пароль"
                  name="password"
                  {...register('password')}
                />
                <span className="underline"></span>
              </div>
            </div>
            <div className="auth-choise">
              <span className="auth-choise-text">
                Нет аккаунта?{' '}
                <span
                  style={{ color: '#23c483', cursor: 'pointer' }}
                  onClick={() => (setLoginOpen(false), setRegisterOpen(true))}
                >
                  Создать
                </span>
              </span>
            </div>
            <button type="submit" className="modal-btn-confirm">
              Войти
            </button>
          </form>

          <div className="modal-inline"></div>

          <div className="modal-info">
            <div className="modal-poster">
              <img
                src="/maxresdefault.png"
                alt=""
                className="modal-poster-img"
              />
            </div>
            <ul>
              <li className="modal-detail-text">
                <img
                  src="/maxresdefault.png"
                  alt="Icon 1"
                  className="list-icon"
                />
                Many training courses for sport interest
              </li>
              <li className="modal-detail-text">
                <img src="/slay.png" alt="Icon 2" className="list-icon" />
                Razlichnik podhot for everybody
              </li>
              <li className="modal-detail-text">
                <img src="/slay.png" alt="Icon 3" className="list-icon" />
                Prosmort otcheta self trenirovok
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Title;
