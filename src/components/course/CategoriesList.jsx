import React, { useEffect, useState } from 'react';
import TrainingCourseService from '../../service/TrainingCourseService';
import CategoryTagListItem from './CategoryTagListItem';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LoadingPageIndicator from "../LoadingPageIndicator";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategoriesWithCourses = async () => {
      setIsLoading(true)
      try {
        const response = await TrainingCourseService.getCategoriesWithCourses();
        setCategories(response.data.categories);
        setTags(response.data.tags);
      } finally {
        setIsLoading(false)
      }
    };

    fetchCategoriesWithCourses();
  }, []);

  const onSubmit = (data) => {
    navigate(`/search/${data.searchQuery}`);
  };

  return (

        isLoading ? (
            <LoadingPageIndicator />
        ) : (
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="search-input-wrapper">
                  <button type={'button'} className="search-icon">
                    <img width="30px" height="30px" src="/search.svg" alt=""/>
                  </button>

                  <input
                      {...register('searchQuery')}
                      placeholder="search.."
                      className="search-course-input"
                      type="text"
                  />
                </div>
              </form>
              {categories.length > 0
                  ? categories.map((category) =>
                      category.trainingCourses.length > 0 ? (
                          <CategoryTagListItem
                              data={category.trainingCourses}
                              title={category.name}
                              key={category.id}
                          />
                      ) : (
                          ''
                      )
                  )
                  : ''}
              {tags.length > 0
                  ? tags.map((tag) =>
                      tag.trainingCourses.length > 0 ? (
                          <CategoryTagListItem
                              data={tag.trainingCourses}
                              title={tag.name}
                              key={tag.id}
                          />
                      ) : (
                          ''
                      )
                  )
                  : ''}
            </div>
        )
  )

};

export default CategoriesList;
