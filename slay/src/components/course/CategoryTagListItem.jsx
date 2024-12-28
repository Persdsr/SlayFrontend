import React from 'react';
import CategoryTrainingCourseItem from "./CategoryTrainingCourseItem";

const CategoryTagListItem = ({category}) => {
    return (
        <div className="category-courses" key={category.id}>
            <div className="category-name-block">
                <h2 style={{
                    fontSize: '38px',
                    color: "#23c483",
                }}>#</h2>
                <h2 className="category-name">{category.name}</h2>
            </div>
            <div className="courses-container">
                {
                    category.trainingCourses.map((course) => (
                        <CategoryTrainingCourseItem course={course} key={course.id} /> // Добавлен key
                    ))
                }
            </div>
            <br/>
        </div>
    );
};

export default CategoryTagListItem;