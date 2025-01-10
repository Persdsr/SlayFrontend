import React, { useEffect, useState } from "react";
import AdminPanelLinks from "../navbar/AdminPanelLinks";
import ComplaintItem from "./ComplaintItem";
import ComplaintService from "../../service/ComplaintService";

const BannedUsers = () => {
    const [currentItems, setCurrentItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBannedUsers = async () => {
            const response = await ComplaintService.getComplaintBannedUsers();
            setCurrentItems(response);
            setFilteredItems(response); // Изначально показываем все данные
        };

        fetchBannedUsers();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Фильтрация по имени пользователя
        const filtered = currentItems.filter((complaint) =>
            complaint.reportedUser.username.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    };

    return (
        <div className="content-container">
            <AdminPanelLinks />

            <div className="content-block">
                <h2>Заблокированные пользователи</h2>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск по имени пользователя..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                <div className="main-content">
                    <div className="banned-users-list-container">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((complaint) => (
                                <ComplaintItem key={complaint.id} complaint={complaint} />
                            ))
                        ) : (
                            <p>Нет данных для отображения.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannedUsers;
