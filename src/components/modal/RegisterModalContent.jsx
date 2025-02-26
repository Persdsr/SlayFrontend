import React, {useState} from 'react';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import {useForm} from "react-hook-form";
import axios from "axios";
import AuthModalInfo from "./AuthModalInfo";

const RegisterModalContent = ({
                                  setErrorMessage,
                                  setRegisterOpen,
                                  errorMessage,
                                  setLoginOpen
                              }) => {
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)

    const {
        register: registerRegister,
        handleSubmit: handleSubmitRegister,
        watch: registerWatch,
        formState: { errors: errorsRegister },
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

    return (
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
                                    }
                                }
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
                      style={{color: '#23c483', cursor: 'pointer'}}
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

            <AuthModalInfo />
        </div>
    );
};

export default RegisterModalContent;