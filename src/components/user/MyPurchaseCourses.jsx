import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import UserService from '../../service/UserService';
import UserLeftToolbar from '../navbar/UserLeftToolbar';
import CategoryTrainingCourseItem from '../course/CategoryTrainingCourseItem';

const MyPurchaseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const authStore = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      const username = authStore?.userData?.username;

      if (!username) {
        return;
      }

      try {
        const sortedData = await UserService.getUserPurchaseCourses(username);
        setCourses(sortedData.data);
        console.log(sortedData.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authStore?.userData?.username]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const myCourses = courses?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(1, Math.ceil(courses?.length / itemsPerPage));
  return (
    <div className="content-container">
      <UserLeftToolbar />

      <div className="content-block">
        <h2>My purchase courses</h2>
        <div className="main-content">
          <div className="horizontal-courses-container">
            <div className="object-list-container">
              {myCourses?.length > 0 ? (
                myCourses.map((course) => (
                  <CategoryTrainingCourseItem course={course} />
                ))
              ) : (
                <p>There is no data to display.</p>
              )}
            </div>
          </div>
        </div>

        {courses?.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Back
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Forward &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchaseCourses;
