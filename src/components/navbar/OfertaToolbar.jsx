import React from 'react';
import { NavLink } from "react-router-dom";

const OfertaToolbar = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="toolbar-list-menu">
            <a
                href="#faq"
                className="left-menu-link"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('faq');
                }}
            >
                <span className="nav-span">FAQ</span>
            </a>

            <a
                href="#license"
                className="left-menu-link"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('license');
                }}
            >
                <span className="nav-span">Лицензионное соглашение</span>
            </a>

            <a
                href="#contacts"
                className="left-menu-link"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contacts');
                }}
            >
                <span className="nav-span">Контакты</span>
            </a>
        </div>
    );
};

export default OfertaToolbar;