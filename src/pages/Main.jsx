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

          <div className="course-catalog-navigate-block">
            <div className="title-poster-block">
              <img src="/white-man.png" alt="" className="title-poster" />
            </div>
            <div className="catalog-navigate-info">
              <h2 className="catalog-title">All course catalog</h2>
              <span className="catalog-navigate-text">
                Alfdok podfll flldl l ldllfdp pddfd
              </span>
              <a href="/courses">
                <button className="catalog-navigate-btn">Посмотреть</button>
              </a>
            </div>
          </div>

          <TipApplication />
        </div>
      )}
    </div>
  );
};

export default Main;
