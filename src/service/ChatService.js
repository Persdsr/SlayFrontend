import axios from 'axios';

export default class ChatService {
  static async getChats(username) {
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
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
    } catch (err) {
      console.log(err.response.data);
    }
  }

  static async getChatDetailById(chatId) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat/c/` + chatId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err.response);
    }
  }

  static async deleteMessageById(messageId) {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat/message` + messageId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
    }
  }
}
