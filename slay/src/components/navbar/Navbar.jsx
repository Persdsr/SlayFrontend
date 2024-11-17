import React from 'react';

const Navbar = () => {
    return (
        <div className="navbar-content">
            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="#categories">Категории</a>
                    <ul className="dropdown-menu">
                        <li><a className="navbar-title" href="#category1">Категория 1</a></li>
                        <li><a className="navbar-title" href="#category2">Категория 2</a></li>
                        <li><a className="navbar-title" href="#category3">Категория 3</a></li>
                    </ul>
                </li>
                <li className="navbar-title"><a href="#about">О нас</a></li>
            </ul>

            <div className="navbar-logo">
                <a href="/"><img className="main-logo" src="/slay.png" alt="logo"/></a>
            </div>

            <ul className="navbar-links">
                <li className="navbar-title dropdown">
                    <a href="/support">Поддержка</a>
                    <ul className="dropdown-menu">
                        <li><a className="navbar-title" href="#faq">FAQ</a></li>
                        <li><a className="navbar-title" href="#docs">Документы</a></li>
                        <li><a className="navbar-title" href="#forum">Форум</a></li>
                    </ul>
                </li>
                <li className="navbar-title"><a href="#contact">Контакты</a></li>
            </ul>
        </div>
    );
};

export default Navbar;
