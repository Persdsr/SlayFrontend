import axios from 'axios';

export default class AdminService {
  static async getAllSortedByDateSupports() {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/support`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data.sort(
      (a, b) => new Date(b.createAt) - new Date(a.createAt)
    );
  }

    static async updateSportCategoryFields(formData, name) {
        return await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/category/` + name,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    }

    static async createSportCategory(formData) {
        return await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/category`, formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    }

}
