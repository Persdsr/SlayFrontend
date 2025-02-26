import React, {useState} from 'react';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import axios from "axios";
import {useForm} from "react-hook-form";

const ForgotPasswordModalContent = ({
                                        setErrorMessage,
                                        errorMessage,

                                    }) => {
    const [responseMessage, setResponseMessage] = useState();
    const [isEmailLoading, setEmailLoading] = useState(false)
    const {
        register: registerForgot,
        handleSubmit: handleSubmitForgot,
        watch:forgotWatch,
        formState: { errors: errorsForgot },
    } = useForm();

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
    );
};

export default ForgotPasswordModalContent;