import React, {useEffect, useState} from 'react';
import SupportService from "../../service/SupportService";
import AdminService from "../../service/AdminService";
import UserRequestsToolbar from "../navbar/UserRequestsToolbar";
import SupportItem from "../admin/SupportItem";
import Filters from "../admin/Filters";
import ComplaintService from "../../service/ComplaintService";
import ComplaintItem from "../admin/ComplaintItem";

const MyComplaintsRequests = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredSupports, setFilteredSupports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [resolvedFilter, setResolvedFilter] = useState("false");
    const [sortOrder, setSortOrder] = useState("desc");
    const itemsPerPage = 7;
    const [supportTypes, setSupportTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortedData = await ComplaintService.getAllUserComplaints("Persdsr");
                setComplaints(sortedData);
                setFilteredSupports(sortedData);

                const types = await ComplaintService.getLocalComplaintTypes();
                setSupportTypes(types);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let result = [...complaints];

        // Поиск
        if (searchQuery) {
            result = result.filter((complaint) =>
                complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтр по типу
        if (filterType) {
            result = result.filter((support) => support.complaintType === filterType);
        }

        // Фильтр по статусу (resolved)
        if (resolvedFilter) {
            const resolvedValue = resolvedFilter === "true";
            result = result.filter((support) => support.resolved === resolvedValue);
        }

        // Сортировка по дате
        result.sort((a, b) => {
            if (sortOrder === "asc") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        setFilteredSupports(result);
        setCurrentPage(1);
    }, [searchQuery, filterType, resolvedFilter, sortOrder, complaints]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSupports?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.max(1, Math.ceil(filteredSupports?.length / itemsPerPage));

    return (
        <div className="admin-container">

            <UserRequestsToolbar />

            <div className="admin-content">
                <h2>Супорты</h2>
                <div className="main-content">
                    <div className="support-list-container">
                        {currentItems?.length > 0 ? (
                            currentItems.map((complaint) => (
                                <ComplaintItem complaint={complaint}/>
                            ))
                        ) : (
                            <p>Нет данных для отображения.</p>
                        )}
                    </div>

                    <Filters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        resolvedFilter={resolvedFilter}
                        setResolvedFilter={setResolvedFilter}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        types={supportTypes}
                    />
                </div>

                {/* Пагинация */}
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

export default MyComplaintsRequests;