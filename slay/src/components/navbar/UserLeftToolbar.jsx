import React from 'react';
import {NavLink} from "react-router-dom";
import {useAuthStore} from "../store/store";

const UserLeftToolbar = () => {
    const authStore = useAuthStore()

    return (
        <div className="toolbar-list-menu">
            <NavLink
                to={`/profile/${authStore?.userData?.username}`}
                className="left-menu-link"
            >
                <span className="nav-span">📞 Profile</span>
            </NavLink>
            <NavLink
                to={`/purchase-courses/`}
                className="left-menu-link"
            >
                <span className="nav-span">📞 My purchase courses</span>
            </NavLink>

            <NavLink
                to={`/messages/`}
                className="left-menu-link"
            >
                <span className="nav-span">📞 Messages</span>
            </NavLink>

            <NavLink
                to="/settings"
                className="left-menu-link"
            >
                <span className="nav-span">⚙️ Settings</span>
            </NavLink>
            <NavLink
                to="/about"
                className="left-menu-link"
            >
                <span className="nav-span">🚫 // nothing //</span>
            </NavLink>
        </div>
    );
};

export default UserLeftToolbar;