import React from 'react';
import CategoryTrainingCourseItem from './CategoryTrainingCourseItem';

const CategoryTagListItem = ({ data, title }) => {
  return (
    <div className="category-courses" key={data.id}>
      <div className="category-name-block">
        <h2
          style={{
            fontSize: '38px',
            color: '#23c483',
            fontFamily: 'sans-serif',
          }}
        >
          #
        </h2>
        <h2 className="category-name">{title}</h2>
      </div>

      <div className="courses-container">
        {data.map((course) => (
          <CategoryTrainingCourseItem course={course} key={course.id} />
        ))}
      </div>
      <br />
    </div>
  );
};

export default CategoryTagListItem;
