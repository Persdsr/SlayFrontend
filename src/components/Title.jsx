import React, { useState } from 'react';
import Modal from './Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { setAuthTokens } from './user/fetcher';
import LoadingMiniIndicator from "./LoadingMiniIndicator";

const Title = () => {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [responseMessage, setResponseMessage] = useState();
  const [isEmailLoading, setEmailLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: loginWatch,
    formState: { errors: errorsLogin },
  } = useForm();

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    watch: registerWatch,
    formState: { errors: errorsRegister },
  } = useForm();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    watch:forgotWatch,
    formState: { errors: errorsForgot },
  } = useForm();

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;
    setIsRegisterLoading(true)

    if (password !== confirmPassword) {
      const errorMessage = document.getElementById('error-message');
      errorMessage.classList.remove('hidden');
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
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
    } finally {
      setIsRegisterLoading(false)
    }
  };

  const onSubmitLogin = (data) => {
    setIsLoginLoading(true)
    try {
      axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signin`, data)
          .then((response) => {
            setAuthTokens(response.data);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err.response.data.message);
            const errorMessage = document.getElementById('error-message');
            errorMessage.classList.remove('hidden');
            setErrorMessage(err.response.data.message);
          });
    } finally {
      setIsLoginLoading(false)
    }
  };

  const onForgotPasswordSubmit = async (data) => {
    const responseMessage = document.getElementById('response-message');
    responseMessage.classList.add('hidden');
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden');
    setEmailLoading(true)
    try {
      const response = await axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot`, {
              },
              {
                params: {
                  email: data.email
                }
              }
          )
      if (response.data.success === true) {
        const responseMessage = document.getElementById('response-message');
        responseMessage.classList.remove('hidden');
        setResponseMessage(response.data.message);
      } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.remove('hidden');
        setErrorMessage(response.data.message);
      }
    } catch (e) {
      console.log(e)
    } finally {
      setEmailLoading(false)
    }
  };

  return (
    <div className="title-block">
      <div className="title-info-block">
        <div className="title-block-content">
          <h1 className="title-block-text">
            <span className="title-block-slay">SLAY</span> - SPORT PLATFORM PRACTICE COURSES
          </h1>
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
        <img src="/logo-man-tools_2.png" alt="" className="title-poster" />
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
          <form className="modal-form" onSubmit={handleSubmitRegister(onSubmit)}>
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

              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-box"
                  placeholder="username"
                  name="username"
                  {...registerRegister('username',
                      {
                        required: "Username is required",
                        minLength: {
                          value: 4,
                          message: "Username must contain from 4 to 26 characters."
                        },
                        maxLength: {
                          value: 26,
                          message: "Username must contain from 4 to 26 characters."
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9]+$/,
                          message: "Username must contain only Latin letters, numbers, and allowed special characters",
                        },
                      }
                  )}
                />
                <span className="underline"></span>
              </div>
              {errorsRegister.username?.message && (
                  <span className="error-message">*{errorsRegister.username?.message}</span>
              )}
              <span id="input-username-hint" className="input-hint">
                The username must not contain special characters (_+#/, etc.)
              </span>

              <div className="input-wrapper">
                <input
                  type="email"
                  className="input-box"
                  placeholder="email"
                  name="email"
                  {...registerRegister('email',
                      {
                        required: "Email is required",
                        minLength: {
                          value: 8,
                          message: "Email max characters - 100"
                        },
                      }
                  )}
                />
                <span className="underline"></span>
              </div>

              {errorsRegister.email?.message && (
                  <span className="error-message">*{errorsRegister.email?.message}</span>
              )}

              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-box"
                  placeholder="name"
                  name="name"
                  {...registerRegister('name',
                      {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must contain from 2 to 70 characters."
                        }}
                  )}
                />
                <span className="underline"></span>
              </div>

              {errorsRegister.name?.message && (
                  <span className="error-message">*{errorsRegister.name?.message}</span>
              )}

              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-box"
                  placeholder="password"
                  name="password"
                  {...registerRegister('password',
                      {
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|\/<>-]+$/,
                          message: "Password must contain only Latin letters, numbers, and allowed special characters",
                        },
                      }
                  )}
                />
                <span className="underline"></span>
              </div>

              {errorsRegister.password?.message && (
                  <span className="error-message">*{errorsRegister.password?.message}</span>
              )}

              <span id="input-password-hint" className="input-hint">
                The password must start with a capital letter and have from 8 to
                32 characters.
              </span>

              <div className="input-wrapper">
                <input type="password"
                       className="input-box"
                       {...registerRegister('confirmPassword', {
                         required: 'Please confirm your password',
                         validate: (value) =>
                             value === registerWatch("password") || 'Passwords do not match',
                       })}
                       placeholder="Confirm password"
                />

                <span className="underline"></span>
              </div>
              {errorsRegister?.confirmPassword && (
                  <p className="error-message">{errorsRegister.confirmPassword?.message}</p>
              )}
            </div>
            <div className="auth-choise">
              <span className="auth-choise-text">
                Already have an account?{' '}
                <span
                    style={{ color: '#23c483', cursor: 'pointer' }}
                  onClick={() => (setRegisterOpen(false), setLoginOpen(true))}
                >
                  Sign in
                </span>
              </span>

            </div>
            {
              isRegisterLoading ? (
                  <LoadingMiniIndicator/>
              ) : (
                  <button type="submit" className="modal-btn-confirm">
                    Register
                  </button>
              )
            }

          </form>

          <div className="modal-info">
            <div className="modal-poster">
              <img
                  src="/logo-man-tools_2.png"
                  alt=""
                  className="modal-poster-img"
              />
            </div>
            <ul>
              <li className="modal-detail-text">
                <img
                    src="/icon-personal-trainer.png"
                    alt="Icon 1"
                    className="list-icon"
                />
                Your personal trainer and a library of training videos are all in one place!
              </li>
              <li className="modal-detail-text">
                <img src="/sportsmen.png" alt="Icon 2" className="list-icon"/>
                Sports, Health and Development – start with the right course and training videos now!
              </li>
              <li className="modal-detail-text">
                <img src="/dnevnikvideo.png" alt="Icon 3" className="list-icon"/>
                Create, learn, be inspired – watch training videos and reach new heights with us!
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <div className="modal-block">
          <form className="modal-form" onSubmit={handleSubmitLogin(onSubmitLogin)}>
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
              <div className="input-wrapper">
                <input
                    type="text"
                    className="input-box"
                    placeholder="username"
                    name="username"
                    {...registerLogin('username', {
                      required: "Username is required",
                          pattern: {
                            value: /^[a-zA-Z0-9]+$/,
                            message: "Username must contain only Latin letters, numbers, and allowed special characters",
                          },
                    }
                    )}
                />
                <span className="underline"></span>
              </div>
              {errorsLogin.username?.message && (
                  <span className="error-message">*{errorsLogin.username.message}</span>
              )}

              <div className="input-wrapper">
                <input
                    type="password"
                    className="input-box"
                    placeholder="password"
                    name="password"
                    {...registerLogin('password', { required: "Password is required",
                      pattern: {
                        value: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|\/<>-]+$/,
                        message: "Password must contain only Latin letters, numbers, and allowed special characters",
                      },})}
                />
                <span className="underline"></span>
              </div>
              {errorsLogin.password?.message && (
                  <span className="error-message">*{errorsLogin.password.message}</span>
              )}
            </div>
            <div className="auth-choise">
        <span className="auth-choise-text">
          New to Slay?{' '}
          <span
              style={{ color: '#23c483', cursor: 'pointer' }}
              onClick={() => (setLoginOpen(false), setRegisterOpen(true))}
          >
            Sign up
          </span>
        </span>
              <br />
              <span className="auth-choise-text">
          <span
              style={{ color: '#23c483', cursor: 'pointer' }}
              onClick={() => (setLoginOpen(false), setForgotPasswordOpen(true))}
          >
            Forgot password?
          </span>
        </span>
            </div>
            {
              isLoginLoading ? (
                  <LoadingMiniIndicator/>
              ) : (
                  <button type="submit" className="modal-btn-confirm">
                    Sign in
                  </button>
              )
            }

          </form>

          <div className="modal-inline"></div>

          <div className="modal-info">
            <div className="modal-poster">
              <img
                  src="/logo-man.png"
                  alt=""
                  className="modal-poster-img"
              />
            </div>
            <ul>
              <li className="modal-detail-text">
                <img
                    src="/icon-personal-trainer.png"
                    alt="Icon 1"
                    className="list-icon"
                />
                Your personal trainer and a library of training videos are all in one place!
              </li>
              <li className="modal-detail-text">
                <img src="/sportsmen.png" alt="Icon 2" className="list-icon"/>
                Sports, Health and Development – start with the right course and training videos now!
              </li>
              <li className="modal-detail-text">
                <img src="/dnevnikvideo.png" alt="Icon 3" className="list-icon"/>
                Create, learn, be inspired – watch training videos and reach new heights with us!
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isForgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
        <div className="modal-block">
          <form className="modal-form" onSubmit={handleSubmitForgot(onForgotPasswordSubmit)}>
            <div id="response-message" className="card-response hidden">
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
              <p>{responseMessage}</p>
            </div>
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

              <div className="input-wrapper">
                <input
                    type="email"
                    className="input-box"
                    placeholder="email"
                    name="email"
                    {...registerForgot('email')}
                />
                <span className="underline"></span>
              </div>

            </div>
            {
              isEmailLoading ?
                  <LoadingMiniIndicator/>
                  : <button type="submit" className="modal-btn-confirm">
                    Send password reset email
                  </button>
            }
          </form>

          <div className="modal-inline"></div>

          <div className="modal-info">
            <div className="modal-poster">
              <img
                  src="/logo-man.png"
                  alt=""
                  className="modal-poster-img"
              />
            </div>
            <ul>
              <li className="modal-detail-text">
                <img
                    src="/icon-personal-trainer.png"
                    alt="Icon 1"
                    className="list-icon"
                />
                Your personal trainer and a library of training videos are all in one place!
              </li>
              <li className="modal-detail-text">
                <img src="/sportsmen.png" alt="Icon 2" className="list-icon"/>
                Sports, Health and Development – start with the right course and training videos now!
              </li>
              <li className="modal-detail-text">
                <img src="/dnevnikvideo.png" alt="Icon 3" className="list-icon"/>
                Create, learn, be inspired – watch training videos and reach new heights with us!
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Title;
