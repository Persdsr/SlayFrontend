import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404 - Страница не найдена</h1>
            <p>К сожалению, такой страницы не существует.</p>
            <Link to="/">Вернуться на главную</Link>
        </div>
    );
};

export default NotFound;