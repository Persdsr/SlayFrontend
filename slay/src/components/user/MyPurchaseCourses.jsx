import React, {useEffect, useState} from 'react';
import UserRequestsToolbar from "../navbar/UserRequestsToolbar";
import ComplaintItem from "../admin/ComplaintItem";
import Filters from "../admin/Filters";
import ComplaintService from "../../service/ComplaintService";
import {useAuthStore} from "../store/store";
import UserService from "../../service/UserService";
import UserLeftToolbar from "../navbar/UserLeftToolbar";
import CategoryTrainingCourseItem from "../course/CategoryTrainingCourseItem";

const MyPurchaseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredSupports, setFilteredSupports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [resolvedFilter, setResolvedFilter] = useState("false");
    const [sortOrder, setSortOrder] = useState("desc");
    const itemsPerPage = 7;
    const [supportTypes, setSupportTypes] = useState([]);
    const authStore = useAuthStore()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortedData = await UserService.getUserPurchaseCourses();
                console.log(sortedData)
                setCourses(sortedData.data);
                setFilteredSupports(sortedData.data);

                const types = await ComplaintService.getLocalComplaintTypes();
                setSupportTypes(types);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [authStore?.userData?.username]);

    useEffect(() => {
        let result = [...courses];

        // Поиск
        if (searchQuery) {
            result = result.filter((complaint) =>
                complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSupports(result);
        setCurrentPage(1);
    }, [searchQuery, filterType, resolvedFilter, sortOrder, courses]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const myCourses = filteredSupports?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.max(1, Math.ceil(filteredSupports?.length / itemsPerPage));
    return (
        <div className="content-container">

            <UserLeftToolbar />

            <div className="content-block">
                <h2>My purchase courses</h2>
                <div className="main-content">
                    <div className="horizontal-courses-container">
                        <div className="support-list-container">
                            {myCourses?.length > 0 ? (
                                myCourses.map((course) => (
                                    <CategoryTrainingCourseItem course={course}/>
                                ))
                            ) : (
                                <p>Нет данных для отображения.</p>
                            )}
                        </div>
                    </div>

                </div>

                {filteredSupports?.length > 0 && (
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

export default MyPurchaseCourses;