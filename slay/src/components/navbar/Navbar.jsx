import React, {useEffect, useState} from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";
import {useAuthStore} from "../store/store";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const authStore = useAuthStore(); // Подключение к состоянию авторизации

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await TrainingCourseService.getSportCategoriesName();
                setCategories(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке категорий:", error);
            }
        };

        fetchCategories();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken"); // Удаление токена из хранилища
        window.location.reload(); // Перезагрузка страницы
    };

    return (
        <div className="navbar-content">
            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="/courses">Категории</a>
                    <ul className="dropdown-menu">
                        {
                            categories?.map((category) => (
                                <li key={category}><a className="navbar-title" href={category}>{category}</a></li>
                            ))
                        }
                    </ul>
                </li>
                <li className="navbar-title"><a href="/about">О нас</a></li>
            </ul>

            <div className="navbar-logo">
                <a href="/"><img className="main-logo" src="/slay.png" alt="logo" /></a>
            </div>

            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="/support">Поддержка</a>
                    <ul className="dropdown-menu">
                        <li><a className="navbar-title" href="#faq">FAQ</a></li>
                        <li><a className="navbar-title" href="/my-supports">Мои запросы</a></li>
                        <li><a className="navbar-title" href="#forum">Форум</a></li>
                    </ul>
                </li>
                {
                    authStore?.userData?.username === "anonymousUser" ? (
                        <li className="navbar-title"><a href="/login">Авторизация</a></li>
                    ) : (
                        <li className="navbar-title dropdown">
                            <a href={`/${authStore?.userData?.username}`}>
                                {authStore?.userData?.username || ""}
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="navbar-title" href="/admin/support">Админ панель</a></li>
                                <li><a className="navbar-title" href="#docs">Документы</a></li>
                                <li><a className="navbar-title" style={{cursor: "pointer"}} onClick={logout}>Выйти</a></li>
                            </ul>
                        </li>
                    )
                }
            </ul>
        </div>
    );

};

export default Navbar;
