import React from 'react';
import Title from '../components/Title';
import TipApplication from '../components/TipApplication';
import { useAuthStore } from '../components/store/store';
import CategoriesList from '../components/course/CategoriesList';

const Main = () => {
  const authStore = useAuthStore();
  return (
    <div>
      {authStore?.authenticated === true ? (
        <div className="courses-catalog-container">
          <CategoriesList />
        </div>
      ) : (
        <div>
          <Title />

          <div className="courses-catalog-navigate-container">
            <div className="course-catalog-navigate-block">
              <div className="title-poster-block">
                <img src="/white-man.png" alt="" className="title-poster"/>
              </div>
              <div className="catalog-navigate-info">
                <h2 className="catalog-title">All courses catalog</h2>
                <span className="catalog-navigate-text">
                Your path to perfect fitness begins with the first step – choose your course and start today!
              </span>
                <a href="/courses">
                  <button className="catalog-navigate-btn">GO!</button>
                </a>
              </div>
            </div>
          </div>


            <TipApplication/>
          </div>
          )}
        </div>
      );
      };

      export default Main;
