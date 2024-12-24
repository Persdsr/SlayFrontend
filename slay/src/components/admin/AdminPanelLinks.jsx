import React from 'react';
import {NavLink} from "react-router-dom";

const AdminPanelLinks = () => {
    return (
        <div className="toolbar-list-menu">
            <NavLink
                to="/admin/support"
                className="admin-menu-link"
            >
                    <span role="img" aria-label="support">
                        📞
                    </span>{" "}
                Поддержка
            </NavLink>
            <NavLink
                to="/admin/complaints"
                className="admin-menu-link"
            >
                    <span role="img" aria-label="complaints">
                        📝
                    </span>{" "}
                Жалобы
            </NavLink>
            <NavLink
                to="/admin/banned-users"
                className="admin-menu-link"
            >
                    <span role="img" aria-label="banned">
                        🚫
                    </span>{" "}
                Забаненные пользователи
            </NavLink>
        </div>
    );
};

export default AdminPanelLinks;