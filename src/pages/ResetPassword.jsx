import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import UserService from "../service/UserService";

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState();

    const token = searchParams.get("token");


    const onSubmit = async (data) => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.add('hidden');

        try {
            const response = await UserService.resetPassword(token, data.newPassword);
            if (response.data.success === true) {
                navigate("/");
            } else {
                const errorMessage = document.getElementById('error-message');
                errorMessage.classList.remove('hidden');
                setErrorMessage("The link to change the password has expired, please try to make the request again.");
            }

        } catch (error) {
            console.error(error);

        }
    };

    return (
        <div className="reset-password-container">
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
            <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
                <input type="password"
                       placeholder="New password"
                       className="simple-input"
                       {...register("newPassword",
                           {
                               required: "Password is required",
                               minLength: {
                                   value: 8,
                                   message: "Password must be at least 8 characters"
                               },
                               pattern: {
                                   value: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>-]+$/,
                                   message: "Password must contain only Latin letters, numbers, and allowed special characters",
                               },
                           }
                       )}

                />
                {errors.newPassword && (
                    <p className="error-message">{errors.newPassword.message}</p>
                )}
                <input type="password"
                       className="simple-input"
                       {...register('confirmPassword', {
                           required: 'Please confirm your password',
                           validate: (value) =>
                               value === watch("newPassword") || 'Passwords do not match',

                       })}
                    placeholder="Confim new password"
                />
                {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword.message}</p>
                )}
                <button className="green-center-btn">Save password</button>
            </form>
        </div>
    );
};

export default ResetPassword;