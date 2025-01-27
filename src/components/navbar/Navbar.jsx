import React, {useEffect, useState} from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";
import {useAuthStore} from "../store/store";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const authStore = useAuthStore(); // Подключение к состоянию авторизации
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await TrainingCourseService.getSportCategoriesName();
                setCategories(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        navigate("/")
        window.location.reload()
    };

    return (
        <div className="navbar-content">
            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="/courses">Categories</a>
                    <ul className="dropdown-menu">
                        {
                            categories?.map((category) => (
                                <li key={category.name}><a className="navbar-title" href={category.name}>{category.name}</a></li>
                            ))
                        }
                    </ul>
                </li>
                <li className="navbar-title"><a href="/about">About us</a></li>
            </ul>

            <div className="navbar-logo">
                <a href="/"><img className="main-logo" src="/logo.png" alt="logo" /></a>
            </div>

            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="/support">Support</a>
                    <ul className="dropdown-menu">
                        <li><a className="navbar-title" href="#faq">FAQ</a></li>
                        <li><a className="navbar-title" href="/my-supports">My supports</a></li>
                    </ul>
                </li>
                {
                    authStore?.authenticated === false ? (
                        <li className="navbar-title"><a href="/">Sign in</a></li>
                    ) : (
                        <li className="navbar-title dropdown">
                            <a href={`/profile/${authStore?.userData?.username}`}>
                                {authStore?.userData?.username || ""}
                            </a>
                            <ul className="dropdown-menu">
                                {
                                    authStore?.userData.roles.includes("ADMIN", "MODERATOR")
                                        ? <li><a className="navbar-title" href="/admin/support">Admin panel</a></li>
                                        : ""
                                }

                                <li><a className="navbar-title" href={`/profile/${authStore.userData.username}`}>Profile</a></li>
                                <li><a className="navbar-title" href="/messages">Messages</a></li>
                                <li><a className="navbar-title" href="/settings">Settings</a></li>
                                <li><a className="navbar-title-red" style={{cursor: "pointer"}} onClick={logout}>Exit</a></li>
                            </ul>
                        </li>
                    )
                }
            </ul>
        </div>
    );

};

export default Navbar;
