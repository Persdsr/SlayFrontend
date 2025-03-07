import axios from 'axios';

export default class FileService {
  static async uploadFiles(formData) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/files/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response;
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  static getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'];

    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return 'unknown';
    }
  }
}
