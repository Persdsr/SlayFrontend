import React from 'react';
import {Link} from "react-router-dom";

const CategoryTrainingCourseItem = ({course}) => {
    return (
        <div className="course-block">
            <a href={`/course/${course?.id}`}>
                <img className="course-poster" src={course?.poster} alt=""/>
            </a>
            <div className="catalog-author-info">
                <div className="course-avatar-block">
                    <a className="catalog-author-avatar" href="#">
                                                <span>
                                                    <img className="catalog-author-avatar"
                                                         src={course.author.avatar}
                                                         alt=""/>
                                                </span>
                    </a>
                    <svg className="catalog-half-circle" viewBox="0 0 106 57">
                        <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
                </div>
                <div className="author-name">
                    <span className="course-name">{course?.name}</span>
                    <Link to={`/profile/${course?.author.username}`}><span className="card-author-name">{course?.author.username}</span></Link>
                </div>
            </div>
        </div>
    );
};

export default CategoryTrainingCourseItem;