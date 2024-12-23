import React, { useEffect, useState } from "react";
import AdminPanelLinks from "./AdminPanelLinks";
import axios from "axios";
import { format } from "date-fns";
import AdminService from "../../service/AdminService";
import Filters from "./Filters";
import SupportItem from "./SupportItem";

const AdminSupport = () => {
    const [supports, setSupports] = useState([]);
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
                const sortedData = await AdminService.getAllSortedByDateSupports();
                setSupports(sortedData);
                setFilteredSupports(sortedData);

                const types = await AdminService.getSupportRequestTypes();
                setSupportTypes(types);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Фильтры и поиск
    useEffect(() => {
        let result = [...supports];

        // Поиск
        if (searchQuery) {
            result = result.filter((support) =>
                support.subject.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтр по типу
        if (filterType) {
            result = result.filter((support) => support.requestType === filterType);
        }

        // Фильтр по статусу (resolved)
        if (resolvedFilter) {
            const resolvedValue = resolvedFilter === "true";
            result = result.filter((support) => support.resolved === resolvedValue);
        }

        // Сортировка по дате
        result.sort((a, b) => {
            if (sortOrder === "asc") {
                return new Date(a.createAt) - new Date(b.createAt);
            } else {
                return new Date(b.createAt) - new Date(a.createAt);
            }
        });

        setFilteredSupports(result);
        setCurrentPage(1);
    }, [searchQuery, filterType, resolvedFilter, sortOrder, supports]);

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSupports.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.max(1, Math.ceil(filteredSupports.length / itemsPerPage));

    return (
        <div className="admin-container">
            <AdminPanelLinks />

            <div className="admin-content">
                <h2>Супорты</h2>
                <div className="main-content">
                    <div className="support-list-container">
                        {currentItems.length > 0 ? (
                            currentItems.map((support) => (
                                <SupportItem support={support} />
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
                {filteredSupports.length > 0 && (
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

export default AdminSupport;
