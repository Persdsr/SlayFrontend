import React, { useEffect, useState } from 'react';
import SupportService from '../../service/SupportService';
import SupportItem from './SupportItem';
import Filters from '../filter/Filters';
import UserRequestsToolbar from '../navbar/UserRequestsToolbar';
import { useAuthStore } from '../store/store';
import LoadingMiniIndicator from "../LoadingMiniIndicator";
import LoadingPageIndicator from "../LoadingPageIndicator";

const MySupportRequests = () => {
  const [supports, setSupports] = useState([]);
  const [filteredSupports, setFilteredSupports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState('false');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 7;
  const [supportTypes, setSupportTypes] = useState([]);
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const sortedData = await SupportService.getAllUserSupports(
          authStore?.userData.username
        );
        setSupports(sortedData);
        setFilteredSupports(sortedData);

        const types = await SupportService.getSupportRequestTypes();
        setSupportTypes(types);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, [authStore?.userData?.username]);

  useEffect(() => {
    let result = [...supports];

    if (searchQuery) {
      result = result.filter((support) =>
        support.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter((support) => support.requestType === filterType);
    }

    if (resolvedFilter) {
      const resolvedValue = resolvedFilter === 'true';
      result = result.filter((support) => support.resolved === resolvedValue);
    }

    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createAt) - new Date(b.createAt);
      } else {
        return new Date(b.createAt) - new Date(a.createAt);
      }
    });

    setFilteredSupports(result);
    setCurrentPage(1);
  }, [searchQuery, filterType, resolvedFilter, sortOrder, supports]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSupports?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSupports?.length / itemsPerPage)
  );

  return (
    <div className="content-container">

      <div className="content-block">
        <h2>Supports</h2>
        {
          isLoading ? (
                  <LoadingMiniIndicator />
              ) :
              <div className="main-content">
                <div className="object-list-container">
                  {currentItems?.length > 0 ? (
                      currentItems.map((support) => <SupportItem support={support}/>)
                  ) : (
                      <p>There is no data to display.</p>
                  )}
                  {filteredSupports?.length > 0 && (
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
        }
      </div>
    </div>
  );
};

export default MySupportRequests;
