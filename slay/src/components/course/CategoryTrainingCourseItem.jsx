import React from 'react';

const CategoryTrainingCourseItem = ({course}) => {

    return (
        <div className="course-block">
            <a href={`/course/detail/${1}`}>
                <img className="course-poster" src={course.poster} alt=""/>
            </a>
            <div className="catalog-author-info">
                <div className="course-avatar-block">
                    <a className="catalog-author-avatar" href="#">
                                                <span>
                                                    <img className="catalog-author-avatar"
                                                         src="https://steamuserimages-a.akamaihd.net/ugc/782989521799828488/99CC5CFF94186C28A21C7E81D145E9C6550DCC14/?imw=512&amp;imh=499&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true"
                                                         alt=""/>
                                                </span>
                    </a>
                    <svg className="catalog-half-circle" viewBox="0 0 106 57">
                        <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
                </div>
                <div className="author-name">
                    <span className="course-name">{course.name} аыва аыуавууууу ууууууы ауауаау</span>
                    <a href={`/${course?.author}`}><span className="card-author-name">{course?.author}</span></a>
                </div>
            </div>
        </div>
    );
};

export default CategoryTrainingCourseItem;