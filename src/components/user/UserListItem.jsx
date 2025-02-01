import React from 'react';
import CategoryTrainingCourseItem from '../course/CategoryTrainingCourseItem';
import { Link } from 'react-router-dom';

const UserListItem = ({ data }) => {
  return (
    <div className="category-courses" key={data.id}>
      <div className="courses-container">
        {data.map((user) => (
          <div className="user-item-block">
            <Link to={`/profile/${user.username}`} className="user-item">
              <img src={user.avatar} alt="" />
              <h2>{user.username}</h2>
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default UserListItem;
