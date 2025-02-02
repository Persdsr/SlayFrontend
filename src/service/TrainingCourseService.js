import axios from 'axios';

export default class TrainingCourseService {
  static async getTrainingCourseById(id) {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/training-course/detail/` + id,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
  }

  static async getAuthorTrainingCourses(username) {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/user/` + username,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
  }

  static async getTrainingCoursesByAuthor() {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/training-course/my-courses`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
  }

  static async getSportCategoriesName() {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/category/categories-name`
    );
  }

  static async getCategoriesWithCourses() {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/category/training-courses`
    );
  }

  static async deleteCourseById(id) {
    return await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/training-course/` + id,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
  }

  static async updateTrainingCourseByFields(id, fields) {
    return await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/api/training-course/update-fields/${id}`,
      fields
    );
  }

  static async getAllCategoriesNames() {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/category/categories-name`
    );
  }

  static async getAllCategoriesWitTags() {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/category/categories-tags`
    );
  }

  static async getTagsCoursesAndAuthorName(searchQuery) {
    return await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/training-course/search`,
      {
        params: {
          searchQuery: searchQuery,
        },
      }
    );
  }

  static async handleByCourse(courseId) {
    return await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/training-course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }}
    );
  }
}
