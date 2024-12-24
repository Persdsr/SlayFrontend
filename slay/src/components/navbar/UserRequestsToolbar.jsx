import React from 'react';
import {NavLink} from "react-router-dom";

const UserRequestsToolbar = () => {
    return (
        <div className="toolbar-list-menu">
            <NavLink
                to="/my-supports"
                className="admin-menu-link"
            >
                    <span role="img" aria-label="support">
                        📞
                    </span>{" "}
                Supports
            </NavLink>
            <NavLink
                to="/my-complaints"
                className="admin-menu-link"
            >
                    <span role="img" aria-label="complaints">
                        📝
                    </span>{" "}
                Complaints
            </NavLink>

        </div>
    );
};

export default UserRequestsToolbar;