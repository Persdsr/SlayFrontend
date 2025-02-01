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
      <h3>Filters</h3>
      <div className="filter-group">
        <label>search by topic:</label>
        <input
          type="text"
          placeholder="Select type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>Request type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All</option>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Resolved:</label>
        <select
          value={resolvedFilter}
          onChange={(e) => setResolvedFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Sort by date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Decreasing order</option>
          <option value="asc">
              Increasing</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
