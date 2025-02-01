import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const UserLeftToolbar = () => {
  const authStore = useAuthStore();

  return (
    <div className="toolbar-list-menu">
      <NavLink
        to={`/profile/${authStore?.userData?.username}`}
        className="left-menu-link"
      >
        <span className="nav-span">📞 Profile</span>
      </NavLink>

      <NavLink to={`/purchase-courses/`} className="left-menu-link">
        <span className="nav-span">📞 Purchase courses</span>
      </NavLink>

      <NavLink to={`/my-courses/`} className="left-menu-link">
        <span className="nav-span">📞 My courses</span>
      </NavLink>

      <NavLink to={`/messages/`} className="left-menu-link">
        <span className="nav-span">📞 Messages</span>
      </NavLink>

      <NavLink to="/settings" className="left-menu-link">
        <span className="nav-span">⚙️ Settings</span>
      </NavLink>
    </div>
  );
};

export default UserLeftToolbar;
