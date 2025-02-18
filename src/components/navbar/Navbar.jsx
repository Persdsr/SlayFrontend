import React, { useEffect, useState, useRef } from 'react';
import TrainingCourseService from '../../service/TrainingCourseService';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null); // Состояние для управления видимостью dropdown
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref для отслеживания кликов вне dropdown

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await TrainingCourseService.getSportCategoriesName();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const logout = () => {
    authStore.resetAuth();
    navigate('/');
    window.location.reload();
  };

  // Обработчик клика для открытия/закрытия dropdown
  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  // Закрытие dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className="navbar-content">
        <ul className="navbar-links">
          <li className="navbar-title dropdown" ref={dropdownRef}>
            <a href="/courses" onClick={(e) => { e.preventDefault(); toggleDropdown('categories'); }}>
              Categories
            </a>
            <ul className={`dropdown-menu ${dropdownVisible === 'categories' ? 'visible' : ''}`}>
              {categories.length > 0
                  ? categories?.map((category) => (
                      <li key={category.name}>
                        <a className="navbar-title" href={`/search/${category.name}`}>
                          {category.name}
                        </a>
                      </li>
                  ))
                  : ''}
            </ul>
          </li>
          <li className="navbar-title">
            <a href="/about">About us</a>
          </li>
        </ul>

        <div className="navbar-logo">
          <a href="/">
            <img className="main-logo" src="/logo.png" alt="logo" />
          </a>
        </div>

        <ul className="navbar-links">
          {authStore?.authenticated === false ? (
              <li className="navbar-title dropdown">
                <a className="navbar-title" href="#faq">
                  FAQ
                </a>
              </li>
          ) : (
              <li className="navbar-title dropdown" ref={dropdownRef}>
                <a href="/support" onClick={(e) => { e.preventDefault(); toggleDropdown('support'); }}>
                  Support
                </a>
                <ul className={`dropdown-menu ${dropdownVisible === 'support' ? 'visible' : ''}`}>
                  <li>
                    <a className="navbar-title" href="#faq">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title" href="/support">
                      Write to support
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title" href="/my-supports">
                      My supports
                    </a>
                  </li>
                </ul>
              </li>
          )}

          {authStore?.authenticated === false ? (
              <li className="navbar-title">
                <a href="/">Sign in</a>
              </li>
          ) : (
              <li className="navbar-title dropdown" ref={dropdownRef}>
                <a href={`/profile/${authStore?.userData?.username}`} onClick={(e) => { e.preventDefault(); toggleDropdown('profile'); }}>
                  {authStore?.userData?.username || ''}
                </a>
                <ul className={`dropdown-menu ${dropdownVisible === 'profile' ? 'visible' : ''}`}>
                  {authStore?.userData.roles.includes('ADMIN', 'MODERATOR') ? (
                      <li>
                        <a className="navbar-title" href="/admin/support">
                          Admin panel
                        </a>
                      </li>
                  ) : (
                      ''
                  )}
                  <li>
                    <a className="navbar-title" href={`/profile/${authStore?.userData.username}`}>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title" href="/messages">
                      Messages
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title" href="/my-courses">
                      My courses
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title" href="/settings">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="navbar-title-red" style={{cursor: 'pointer'}} onClick={logout}>
                      Exit
                    </a>
                  </li>
                </ul>
              </li>
          )}
        </ul>
      </div>
  );
};

export default Navbar;