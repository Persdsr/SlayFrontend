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
            .patch(`http://localhost:8080/api/support/${supportId}`)
            .then((response) => {

            })
            .catch((error) => {
                console.error("Ошибка при удалении запроса:", error);
                alert("Произошла ошибка при удалении запроса.");
            });
    }

    static async changeResolvedStatusSupport(supportId) {
        axios
            .patch(`http://localhost:8080/api/support/${supportId}`)
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
            console.log("Response data:", response.data); // Лог для проверки формата данных
            return response.data ? response.data : []; // Возвращаем массив или пустой массив
        } catch (error) {
            console.error("Error in fetching supports:", error);
            return []; // Возвращаем пустой массив при ошибке
        }
    }

}