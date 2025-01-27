import axios from "axios";

export default class FileService {

    static async uploadFiles(formData) {
        try {
           const response =  await axios.post(
                "http://localhost:8080/api/files/upload",
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
           return response
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    }
}