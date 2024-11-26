import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";


const Admin = () => {
    return (
            <div className="admin-container">
                {/* Левое меню */}
                <div className="admin-list-menu">
                    <NavLink
                        to="/support"
                        className="admin-menu-link"
                        activeClassName="active"
                    >
                        <span role="img" aria-label="support">
                            📞
                        </span>{" "}
                        Поддержка
                    </NavLink>
                    <NavLink
                        to="/complaints"
                        className="admin-menu-link"
                        activeClassName="active"
                    >
                        <span role="img" aria-label="complaints">
                            📝
                        </span>{" "}
                        Жалобы
                    </NavLink>
                    <NavLink
                        to="/banned-users"
                        className="admin-menu-link"
                        activeClassName="active"
                    >
                        <span role="img" aria-label="banned">
                            🚫
                        </span>{" "}
                        Забаненные пользователи
                    </NavLink>
                </div>

                {/* Основной контент */}
                <div className="admin-content">

                </div>
            </div>
    );
};

export default Admin;
