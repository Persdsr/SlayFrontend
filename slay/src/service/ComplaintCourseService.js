import axios from "axios";
import {type} from "@testing-library/user-event/dist/type";

export default class ComplaintCourseService {

    static async getComplaintCourseDetailById(complaintId) {
        const response = await axios.get("http://localhost:8080/api/complaint-course/" + complaintId)
        return response.data;
    }

    static async getComplaintCourseTypes() {
        const response = await axios.get("http://localhost:8080/api/complaint-course/types")
        return response.data;
    }

    static async createComplaintCourse(complaintBody) {
        const response = await axios.post(
            "http://localhost:8080/api/complaint-course",
            complaintBody, // Передаем объект как есть
            {
                headers: {
                    "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        return response.data;
    }

    static async createChatAndFirstMessage(messageBody) {
        const response = await axios.post(
            "http://localhost:8080/api/chat",
            messageBody,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        return response.data;
    }
}