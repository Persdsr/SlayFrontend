import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminPanelLinks = () => {
  return (
    <div className="toolbar-list-menu">
      <NavLink to="/admin/support" className="left-menu-link">
        <span className="nav-span">Supports</span>{' '}
      </NavLink>
      <NavLink to="/admin/complaints" className="left-menu-link">
        <span className="nav-span">Complaints</span>{' '}
      </NavLink>
      <NavLink to="/admin/banned-users" className="left-menu-link">
        <span className="nav-span">Banned users</span>{' '}
      </NavLink>
    </div>
  );
};

export default AdminPanelLinks;
