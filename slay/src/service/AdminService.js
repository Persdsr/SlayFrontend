import axios from "axios";


export default class AdminService {

    static async getAllSortedByDateSupports() {
        const response = await axios.get("http://localhost:8080/api/support")
        return response.data.sort((a, b) =>
            new Date(b.createAt) - new Date(a.createAt));
    }

    static async getSupportDetailById(supportId) {
        const response = await axios.get("http://localhost:8080/api/support/" + supportId)
        return response.data;
    }

    static async getComplaintDetailById(complaintId) {
        const response = await axios.get("http://localhost:8080/api/complaint/" + complaintId)
        return response.data;
    }

    static async getSupportRequestTypes() {
        try {
            const response = await axios.get("http://localhost:8080/api/support/support-request-types");
            return response.data;
        } catch (error) {
            console.error("Error fetching support types:", error);
            throw error;
        }
    }
}