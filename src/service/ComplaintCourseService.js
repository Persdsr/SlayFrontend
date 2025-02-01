import axios from 'axios';

export default class ComplaintCourseService {
  static async getComplaintCourseDetailById(complaintId) {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/complaint-course/` +
        complaintId
    );
    return response.data;
  }

  static async getComplaintCourseTypes() {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/complaint-course/types`
    );
    return response.data;
  }

  static async createComplaintCourse(complaintBody) {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/complaint-course`,
      complaintBody, // Передаем объект как есть
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  }

  static async createChatAndFirstMessage(messageBody) {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
      messageBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  }
}
