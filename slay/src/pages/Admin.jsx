import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import AdminPanelLinks from "../components/admin/AdminPanelLinks";


const Admin = () => {
    return (
            <div className="admin-container">
                <AdminPanelLinks />

                {/* Основной контент */}
                <div className="admin-content">

                </div>
            </div>
    );
};

export default Admin;
