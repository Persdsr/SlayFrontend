import React, { useEffect, useState } from 'react';
import AdminPanelLinks from '../navbar/AdminPanelLinks';
import ComplaintService from '../../service/ComplaintService';
import Filters from '../filter/Filters';
import ComplaintItem from '../complaint/ComplaintItem';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredSupports, setFilteredSupports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState('false');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 7;
  const navigate = useNavigate();
  const [complaintTypes, setComplaintTypes] = useState([]);

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const sortedData = await ComplaintService.getAllSortedByDateComplaint();
        setComplaints(sortedData);
        setFilteredSupports(sortedData);

        const types = await ComplaintService.getLocalComplaintTypes();
        setComplaintTypes(types);
      } catch (e) {
        navigate('/*');
      }
    };

    fetchSupports();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (searchQuery) {
      result = result.filter((complaints) =>
        complaints.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter(
        (complaints) => complaints.complaintType === filterType
      );
    }

    if (resolvedFilter) {
      const resolvedValue = resolvedFilter === 'true';
      result = result.filter(
        (complaints) => complaints.resolved === resolvedValue
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'asc') {
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
  const currentItems = filteredSupports.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSupports.length / itemsPerPage)
  );

  return (
    <div className="content-container">
      <AdminPanelLinks />

      <div className="content-block">
        <h2>Жалобы</h2>
        <div className="main-content">
          <div className="object-list-container">
            {currentItems.length > 0 ? (
              currentItems.map((complaint) => (
                <ComplaintItem complaint={complaint} />
              ))
            ) : (
              <p>Нет данных для отображения.</p>
            )}

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

          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            resolvedFilter={resolvedFilter}
            setResolvedFilter={setResolvedFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            types={complaintTypes}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
