import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default class SupportService {
  static async getSupportDetailById(supportId) {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/support/` + supportId,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  }

  static async deleteSupport(supportId) {
    axios
      .patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/support/${supportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.error('Ошибка при удалении запроса:', error);
        alert('Произошла ошибка при удалении запроса.');
      });
  }

  static async changeResolvedStatusSupport(supportId) {
    axios
      .patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/support/${supportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )

      .then((response) => {
      })
      .catch((error) => {
        console.error('Ошибка при удалении запроса:', error);
        alert('Произошла ошибка при удалении запроса.');
      });
  }

  static async getAllUserSupports(username) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/support/user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response.data ? response.data : [];
    } catch (error) {
      console.error('Error in fetching supports:', error);
      return [];
    }
  }

  static async getSupportRequestTypes() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/support/support-request-types`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching support types:', error);
      throw error;
    }
  }

  static async sendSupport(
    formData,
    setUploadProgress,
    setUploadedFiles,
    reset,
    setRequestResultText
  ) {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/support`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            total: progress,
          }));
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      .then((response) => {
        setUploadedFiles([]);
        setUploadProgress({});
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setRequestResultText(response.data);
      })
      .catch((error) => {
        setRequestResultText(
          'Произошла ошибка при отправке. Попробуйте снова.'
        );
        console.error('Ошибка:', error);
      });
  }
}
