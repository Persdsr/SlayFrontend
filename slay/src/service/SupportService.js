import axios from "axios";
import {useNavigate} from "react-router-dom";

export default class SupportService {

    static async getSupportDetailById(supportId) {
        const response = await axios.get("http://localhost:8080/api/support/" + supportId,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            })
        return response.data;
    }

    static async deleteSupport(supportId) {
        axios
            .patch(`http://localhost:8080/api/support/${supportId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                })
            .then((response) => {

            })
            .catch((error) => {
                console.error("Ошибка при удалении запроса:", error);
                alert("Произошла ошибка при удалении запроса.");
            });
    }

    static async changeResolvedStatusSupport(supportId) {
        axios
            .patch(`http://localhost:8080/api/support/${supportId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
                )

            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при удалении запроса:", error);
                alert("Произошла ошибка при удалении запроса.");
            });
    }

    static async getAllUserSupports(username) {
        try {
            const response = await axios.get(`http://localhost:8080/api/support/user/${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
                );
            console.log("Response data:", response.data);
            return response.data ? response.data : [];
        } catch (error) {
            console.error("Error in fetching supports:", error);
            return [];
        }
    }

    static async getSupportRequestTypes() {
        try {
            const response = await axios.get("http://localhost:8080/api/support/support-request-types",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                });
            return response.data;
        } catch (error) {
            console.error("Error fetching support types:", error);
            throw error;
        }
    }

    static async sendSupport(formData, setUploadProgress, setUploadedFiles, reset, setRequestResultText) {
        axios
            .post("http://localhost:8080/api/support", formData, {
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
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            })

            .then((response) => {
                setUploadedFiles([]);
                setUploadProgress({});
                reset()
                window.scrollTo({ top: 0, behavior: "smooth" }); // Прокрутка наверх
                setRequestResultText(response.data); // Успешный ответ
            })
            .catch((error) => {
                setRequestResultText("Произошла ошибка при отправке. Попробуйте снова."); // Ошибка
                console.error("Ошибка:", error);
            });
    }

}