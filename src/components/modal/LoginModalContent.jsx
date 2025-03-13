import React, {useState} from 'react';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import axios from "axios";
import {setAuthTokens} from "../user/fetcher";
import {useForm} from "react-hook-form";
import AuthModalInfo from "./AuthModalInfo";

const LoginModalContent = ({
                               errorMessage,
                               setLoginOpen,
                               setRegisterOpen,
                               setForgotPasswordOpen,
                               setErrorMessage,

                           }) => {
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        watch: loginWatch,
        formState: { errors: errorsLogin },
    } = useForm();

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
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.classList.remove('hidden');
                    setErrorMessage("Incorrect username or password");
                });
        } finally {
            setIsLoginLoading(false)
        }
    };

    return (
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
                            autoComplete="off"
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
                            {...registerLogin('password', {
                                required: "Password is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|\/<>-]+$/,
                                    message: "Password must contain only Latin letters, numbers, and allowed special characters",
                                },
                            })}
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
                style={{color: '#23c483', cursor: 'pointer'}}
                onClick={() => (setLoginOpen(false), setRegisterOpen(true))}
            >
            Sign up
          </span>
        </span>
                    <br/>
                    <span className="auth-choise-text">
          <span
              style={{color: '#23c483', cursor: 'pointer'}}
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

            <AuthModalInfo />
        </div>
    );
};

export default LoginModalContent;