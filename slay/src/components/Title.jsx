import React, { useState } from 'react';
import Modal from './Modal';

const Title = () => {
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState();
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
            fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username: formValues.username,
                    email: formValues.email,
                    password: formValues.password,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },

            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Что-то пошло не так');
                        });
                    }
                })
                .then(data => {
                    console.log('Успех:', data);
                    // Обработка успешного ответа
                })
                .catch((err) => {
                    setErrorMessage(err.message)
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.classList.remove('hidden'); // Убираем класс hidden
                    console.error(err.message);
                });
        }

    return (
        <div className="title-block">
            <div className="title-info-block">
                <div className="title-block-content">
                    <h1 className="title-block-text"><span className="title-block-slay">SLAY</span> THE BEST GYM PRACTICE COURSES</h1>
                    <span className="title-block-description">Alquam vismmil nvnm fili, aw congue masssa pretm ul in vel jusi ops</span>
                    <div className="title-buttons">
                        <button className="title-block-button" onClick={() => setRegisterOpen(true)}>Регистрация</button>
                        <button className="title-block-button" onClick={() => setLoginOpen(true)}>Войти</button>
                    </div>
                </div>
            </div>

            <div className="title-poster-block">
                <img src="/maxresdefault.png" alt="" className="title-poster" />
            </div>

            <div className="title-detail-block">
                <ul>
                    <li className="title-detail-text">
                        <img src="/maxresdefault.png" alt="Icon 1" className="list-icon" />
                        Many training courses for sport interest
                    </li>
                    <li className="title-detail-text">
                        <img src="/slay.png" alt="Icon 2" className="list-icon" />
                        Razlichnik podhot for everybody
                    </li>
                    <li className="title-detail-text">
                        <img src="/slay.png" alt="Icon 3" className="list-icon" />
                        Prosmort otcheta self trenirovok
                    </li>
                </ul>
            </div>

            <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
                <div className="modal-block">
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div id="error-message" className="card-error hidden">
                            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            <p>{errorMessage}</p>
                        </div>
                        <div className="modal-column">
                            {errors.username && <span className="error-message">*{errors.username}</span>}

                            <div className="input-wrapper">
                                <input type="text"
                                       className="input-box"
                                       placeholder="Имя пользователя"
                                       name="username"
                                       value={formValues.username}
                                       onChange={handleInputChange}
                                />
                                <span className="underline"></span>
                            </div>
                            <span id="input-username-hint" className="input-hint">Имя пользователя не должно содержать специальные символы (_+#/ и т.д.)</span>

                            {errors.email && <span className="error-message">*{errors.email}</span>}
                            <div className="input-wrapper">
                                <input type="email"
                                       className="input-box"
                                       placeholder="email"
                                       name="email"
                                       value={formValues.email}
                                       onChange={handleInputChange}
                                />
                                <span className="underline"></span>
                            </div>

                            {errors.password && <span className="error-message">*{errors.password}</span>}
                            <div className="input-wrapper">
                                <input type="text"
                                       className="input-box"
                                       placeholder="password"
                                       name="password"
                                       value={formValues.password}
                                       onChange={handleInputChange}
                                />
                                <span className="underline"></span>
                            </div>

                            <span id="input-password-hint" className="input-hint">Пароль должен начинаться с заглавной буквы и иметь от 8 до 32 символов</span>

                            {errors.confirmPassword && <span className="error-message">*{errors.confirmPassword}</span>}
                            <div className="input-wrapper">
                                <input type="text"
                                       className="input-box"
                                       placeholder="confirmPassword"
                                       name="confirmPassword"
                                       value={formValues.confirmPassword}
                                       onChange={handleInputChange}
                                />
                                <span className="underline"></span>
                            </div>
                        </div>
                        <div className="auth-choise">
                            <span className="auth-choise-text">Есть аккаунт? <span
                                style={{color: "blue", cursor: "pointer"}}
                                onClick={() => (setRegisterOpen(false), setLoginOpen(true))}>Войти</span></span>
                        </div>
                        <button type="submit" className="modal-btn-confirm">Зарегистрироваться</button>
                    </form>

                    {/*<div className="modal-inline">
                            <input className="input-modal-field" type="text" placeholder="name" required/>
                            <input className="input-modal-field" type="email" placeholder="email" required/>
                        </div>*/}

                    <div className="modal-info">
                        <div className="modal-poster">
                            <img src="/maxresdefault.png" alt="" className="modal-poster-img"/>
                        </div>
                        <ul>
                            <li className="modal-detail-text">
                                <img src="/maxresdefault.png" alt="Icon 1" className="list-icon"/>
                                Many training courses for sport interest
                            </li>
                            <li className="modal-detail-text">
                                <img src="/slay.png" alt="Icon 2" className="list-icon"/>
                                Razlichnik podhot for everybody
                            </li>
                            <li className="modal-detail-text">
                                <img src="/slay.png" alt="Icon 3" className="list-icon"/>
                                Prosmort otcheta self trenirovok
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
                <div className="modal-block">
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div id="error-message" className="card-error hidden">
                            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            <p>{errorMessage}</p>
                        </div>
                        <div className="modal-column">
                            {errors.username && <span className="error-message">*{errors.username}</span>}
                            <input
                                className="input-modal-field"
                                type="text"
                                name="username"
                                placeholder="Имя пользователя"
                                value={formValues.username}
                                onChange={handleInputChange}
                            />

                            {errors.password && <span className="error-message">*{errors.password}</span>}
                            <input
                                className="input-modal-field"
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={formValues.password}
                                onChange={handleInputChange}
                            />

                        </div>
                        <div className="auth-choise">
                            <span className="auth-choise-text">Нет аккаунта? <span style={{color: "blue", cursor: "pointer"}} onClick={() => (setLoginOpen(false), setRegisterOpen(true))}>Создать</span></span>
                        </div>
                        <button type="submit" className="modal-btn-confirm">Войти</button>
                    </form>

                    {/*<div className="modal-inline">
                            <input className="input-modal-field" type="text" placeholder="name" required/>
                            <input className="input-modal-field" type="email" placeholder="email" required/>
                        </div>*/}

                    <div className="modal-info">
                        <div className="modal-poster">
                            <img src="/maxresdefault.png" alt="" className="modal-poster-img"/>
                        </div>
                        <ul>
                            <li className="modal-detail-text">
                                <img src="/maxresdefault.png" alt="Icon 1" className="list-icon"/>
                                Many training courses for sport interest
                            </li>
                            <li className="modal-detail-text">
                                <img src="/slay.png" alt="Icon 2" className="list-icon"/>
                                Razlichnik podhot for everybody
                            </li>
                            <li className="modal-detail-text">
                                <img src="/slay.png" alt="Icon 3" className="list-icon"/>
                                Prosmort otcheta self trenirovok
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Title;
