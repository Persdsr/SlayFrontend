import React from 'react';

const Support = () => {
    return (
        <div className="main">
            <h1 className="main-center-title">SUPPORT</h1>
            <form>
                <input type="email" placeholder="Эл. почта" name="email" />
                <input type="text" placeholder="Тема" name="subject" />
                <textarea placeholder="Описание" name="description" />

            </form>
        </div>
    );
};

export default Support;