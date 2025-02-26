import React from 'react';

const AuthModalInfo = () => {
    return (
        <div className="modal-info">
            <div className="modal-poster">
                <img
                    src="/logo-man-tools_2.png"
                    alt=""
                    className="modal-poster-img"
                />
            </div>
            <ul>
                <li className="modal-detail-text">
                    <img
                        src="/icon-personal-trainer.png"
                        alt="Icon 1"
                        className="list-icon"
                    />
                    Your personal trainer and a library of training videos are all in one place!
                </li>
                <li className="modal-detail-text">
                    <img src="/sportsmen.png" alt="Icon 2" className="list-icon"/>
                    Sports, Health and Development – start with the right course and training videos now!
                </li>
                <li className="modal-detail-text">
                    <img src="/dnevnikvideo.png" alt="Icon 3" className="list-icon"/>
                    Create, learn, be inspired – watch training videos and reach new heights with us!
                </li>
            </ul>
        </div>
    );
};

export default AuthModalInfo;