import React from 'react';

const LoadingMiniIndicator = () => {
    return (
        <div className="mini-loading-container">
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    );
};

export default LoadingMiniIndicator;