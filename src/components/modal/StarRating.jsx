import React, { useState } from 'react';

const StarRating = ({ onChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(5);

    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <img
                        key={starValue}
                        src={starValue <= (hover || rating) ? "/star.png" : "/empty-star.png"}
                        alt="star"
                        onClick={() => {
                            setRating(starValue);
                            onChange(starValue);
                        }}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                        style={{ cursor: 'pointer', width: '24px', height: '24px', marginRight: '4px' }}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;