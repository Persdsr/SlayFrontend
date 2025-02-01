import React, { useEffect, useState } from 'react';
import CategoriesList from './CategoriesList';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryTagListItem from './CategoryTagListItem';
import { useForm } from 'react-hook-form';
import TrainingCourseService from '../../service/TrainingCourseService';
import UserListItem from '../user/UserListItem';
import LoadingIndicator from '../LoadingIndicator';

const TrainingCourseSearch = () => {
  const params = useParams();
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await TrainingCourseService.getTagsCoursesAndAuthorName(
            params.searchQuery
          );
        setCourses(response.data.courses);
        setTags(response.data.tags);
        setCategories(response.data.categories);
        setUsers(response.data.authors);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.searchQuery]);

  const onSubmit = (data) => {
    navigate(`/search/${data.searchQuery}`);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="courses-catalog-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="search-input-wrapper">
          <button type={'button'} className="search-icon">
            <img width="30px" height="30px" src="/search.svg" alt="" />
          </button>
          <input
            {...register('searchQuery')}
            placeholder="search.."
            className="search-course-input"
            type="text"
          />
        </div>
      </form>
      {courses?.length > 0 ? (
        <CategoryTagListItem
          data={courses}
          title={params.searchQuery}
          key={courses.id}
        />
      ) : (
        ''
      )}
      {users?.length > 0 ? <UserListItem data={users} /> : ''}
      {categories.map((category) =>
        category.trainingCourses?.length > 0 ? (
          <CategoryTagListItem
            data={category.trainingCourses}
            title={category.name}
            key={category.id}
          />
        ) : (
          ''
        )
      )}
      {tags.map((tag) =>
        tag.trainingCourses.length > 0 ? (
          <CategoryTagListItem
            data={tag.trainingCourses}
            title={tag.name}
            key={tag.id}
          />
        ) : (
          ''
        )
      )}
    </div>
  );
};

export default TrainingCourseSearch;
