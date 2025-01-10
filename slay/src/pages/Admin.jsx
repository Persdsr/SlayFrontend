import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import AdminPanelLinks from "../components/navbar/AdminPanelLinks";


const Admin = () => {
    return (
            <div className="content-container">
                <AdminPanelLinks />

                {/* Основной контент */}
                <div className="content-block">

                </div>
            </div>
    );
};

export default Admin;
