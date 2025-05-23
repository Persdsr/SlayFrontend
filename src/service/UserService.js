import axios from 'axios';

export default class UserService {
  static async signUp(data) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`,
        data
      );
      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      const errorMessage = document.getElementById('error-message');
      errorMessage.classList.remove('hidden');
      return err.response.data.message;
    }
  }

  static async followToUser(followBody) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/follow`,
        followBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      return response;
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  static async unFollowToUser(followBody) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/unfollow`,
        followBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response;
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  static async updateUserData(formData) {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/api/user/update_user_fields`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response;
  }

  static async getUserProfileData(username) {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
          params: {
            username: username
          }
      }
    );
    return response;
  }

  static async getUserPurchaseCourses(username) {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/user/purchase-courses`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          username: username
        }
      }
    );
    return response;
  }

  static async resetPassword(token, password) {
    const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/reset`,
        {
          },
        {
          params: {
            token: token,
            newPassword: password
        }
        }
    );
    return response;
  }

}

