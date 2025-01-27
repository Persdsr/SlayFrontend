import React from 'react';
import {NavLink} from "react-router-dom";

const AdminPanelLinks = () => {
    return (
        <div className="toolbar-list-menu">
            <NavLink
                to="/admin/support"
                className="left-menu-link"
            >
                    <span className="nav-span">
                        📞 Поддержка
                    </span>{" "}

            </NavLink>
            <NavLink
                to="/admin/complaints"
                className="left-menu-link"
            >
                    <span className="nav-span">
                        📝 Жалобы
                    </span>{" "}

            </NavLink>
            <NavLink
                to="/admin/banned-users"
                className="left-menu-link"
            >
                    <span className="nav-span">
                        🚫 Забаненные пользователи
                    </span>{" "}

            </NavLink>
        </div>
    );
};

export default AdminPanelLinks;