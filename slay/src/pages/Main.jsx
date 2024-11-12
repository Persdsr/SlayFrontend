import React from 'react';
import Title from "../components/Title";
import TipApplication from "../components/TipApplication";
import Footer from "../components/Footer";

const Main = () => {
    return (
        <div>
            <Title/>

            <div className="course-catalog-navigate-block">
                <div className="title-poster-block">
                    <img src="/3dman.png!sw800" alt="" className="title-poster"/>
                </div>
                <div className="catalog-navigate-info">
                    <span className="catalog-navigate-text">Alfdok podfll flldl l ldllfdp pddfd</span>
                    <button className="catalog-navigate-btn">Посмотреть</button>
                </div>
            </div>

            <TipApplication/>

        </div>
    )
        ;
};

export default Main;