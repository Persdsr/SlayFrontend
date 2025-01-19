import React from 'react';

const Filters = ({
                     searchQuery,
                     setSearchQuery,
                     filterType,
                     setFilterType,
                     resolvedFilter,
                     setResolvedFilter,
                     sortOrder,
                     setSortOrder,
                     types,
                 }) => {
    return (
        <div className="filters-container">
            <h3>Фильтры</h3>
            <div className="filter-group">
                <label>Поиск по теме:</label>
                <input
                    type="text"
                    placeholder="Введите тему..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="filter-group">
                <label>Тип запроса:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">Все</option>
                    {types.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filter-group">
                <label>Решено:</label>
                <select value={resolvedFilter} onChange={(e) => setResolvedFilter(e.target.value)}>
                    <option value="">Все</option>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </div>
            <div className="filter-group">
                <label>Сортировать по дате:</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">По убыванию</option>
                    <option value="asc">По возрастанию</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;