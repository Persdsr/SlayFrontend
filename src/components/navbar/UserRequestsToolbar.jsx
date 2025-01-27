import React from 'react';
import {NavLink} from "react-router-dom";

const UserRequestsToolbar = () => {
    return (
        <div className="toolbar-list-menu">
            <NavLink className="left-menu-link"
                to="/my-supports"
            >
                    <span className="nav-span">
                        📞 Supports
                    </span>{" "}

            </NavLink>
            <NavLink className="left-menu-link"
                to="/my-complaints"
            >
                    <span className="nav-span">
                        📝 Complaints
                    </span>{" "}
            </NavLink>

        </div>
    );
};

export default UserRequestsToolbar;