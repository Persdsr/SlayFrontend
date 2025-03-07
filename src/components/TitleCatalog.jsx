import React from 'react';

const TitleCatalog = () => {
    return (
        <div className="title-catalog-container">
            <h1>All courses catalog</h1>
            <span className="catalog-desc">
                Your path to perfect fitness begins with the first step – choose your course and start today!
            </span>
            <div className="scroll-container">
                <div className="scroll-block" style={{"--t": "45s"}}>
                    <div>
                        <span>Bodybuilding</span>
                        <span>Powerlifting</span>
                        <span>Дома</span>
                        <span>Кардио</span>
                        <span>goals</span>
                        <span>fitnessworkout</span>
                        <span>Armwrestling</span>
                        <span>Fitness</span>
                        <span>sport</span>
                        <span>Cardio</span>
                        <span>Gym</span>
                    </div>
                    <div>
                        <span>Bodybuilding</span>
                        <span>Powerlifting</span>
                        <span>Дома</span>
                        <span>Кардио</span>
                        <span>goals</span>
                        <span>fitnessworkout</span>
                        <span>Armwrestling</span>
                        <span>Fitness</span>
                        <span>sport</span>
                        <span>Cardio</span>
                        <span>Gym</span>

                    </div>
                </div>
                <div className="scroll-block" style={{"--t": "45s"}}>
                    <div>
                        <span>Bodybuilding</span>
                        <span>Powerlifting</span>
                        <span>goals</span>
                        <span>Motivation</span>
                        <span>fitnessworkout</span>
                        <span>Дома</span>
                        <span>Armwrestling</span>
                        <span>yoga</span>
                        <span>Fitness</span>
                        <span>beachbody</span>
                        <span>Cardio</span>

                    </div>
                    <div>
                        <span>Bodybuilding</span>
                        <span>Кардио</span>
                        <span>goals</span>
                        <span>Powerlifting</span>
                        <span>Motivation</span>
                        <span>beachbody</span>
                        <span>Armwrestling</span>
                        <span>Fitness</span>
                        <span>Cardio</span>
                        <span>Жим лежа</span>
                        <span>fitnessworkout</span>

                    </div>
                </div>
            </div>

            <a href="/courses">
                <button className="catalog-navigate-btn">Get started!</button>
            </a>
        </div>
    );
};

export default TitleCatalog;