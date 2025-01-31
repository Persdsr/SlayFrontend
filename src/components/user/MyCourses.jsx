import React, {useEffect, useState} from 'react';
import UserRequestsToolbar from "../navbar/UserRequestsToolbar";
import ComplaintItem from "../complaint/ComplaintItem";
import Filters from "../filter/Filters";
import ComplaintService from "../../service/ComplaintService";
import {useAuthStore} from "../store/store";
import UserService from "../../service/UserService";
import UserLeftToolbar from "../navbar/UserLeftToolbar";
import CategoryTrainingCourseItem from "../course/CategoryTrainingCourseItem";
import TrainingCourseService from "../../service/TrainingCourseService";
import {Link, useNavigate} from "react-router-dom";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const authStore = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TrainingCourseService.getTrainingCoursesByAuthor();
                console.log(response)
                setCourses(response.data);

            } catch (error) {
                console.error("Error fetching data:", error);

            }
        };

        fetchData();
    }, [authStore?.userData?.username]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const myCourses = courses.length > 0 ? courses?.slice(indexOfFirstItem, indexOfLastItem) : []

    const totalPages = Math.max(1, Math.ceil(courses?.length / itemsPerPage));
    return (
        <div className="content-container">

            <UserLeftToolbar />

            <div className="content-block">
                <h2>My courses <Link to={"/create-course"} className="center-tip">Создать</Link></h2>
                <div className="main-content">
                    <div className="horizontal-courses-container">
                        <div className="object-list-container">
                            {myCourses?.length > 0 ? (
                                myCourses.map((course) => (
                                    <CategoryTrainingCourseItem course={course}/>
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
                            &lt; Назад
                        </button>
                        <span className="page-info">
                            Страница {currentPage} из {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Вперед &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;