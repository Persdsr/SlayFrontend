import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const UserLeftToolbar = () => {
  const authStore = useAuthStore();

  return (
    <div className="toolbar-list-menu">
      <NavLink
        to={authStore.authenticated ? `/profile/${authStore?.userData?.username}` : "/"}
        className="left-menu-link"
      >
        <span className="nav-span">Profile</span>
      </NavLink>

      <NavLink to={authStore.authenticated ? `/purchase-courses/` : "/"} className="left-menu-link">
        <span className="nav-span">Purchase courses</span>
      </NavLink>

      <NavLink to={authStore.authenticated ? `/my-courses/` : "/"} className="left-menu-link">
        <span className="nav-span">My courses</span>
      </NavLink>

      <NavLink to={authStore.authenticated ? `/messages/` : "/"} className="left-menu-link">
        <span className="nav-span">Messages</span>
      </NavLink>

      <NavLink to={authStore.authenticated ? `/settings` : "/"} className="left-menu-link">
        <span className="nav-span">Settings</span>
      </NavLink>
    </div>
  );
};

export default UserLeftToolbar;
