import axios from "axios";

export default class ComplaintService {

    static async getAllSortedByDateComplaint() {
        const response = await axios.get("http://localhost:8080/api/complaint");
        return response.data.sort((a, b) =>
            new Date(b.createAt) - new Date(a.createAt)
        );

    }

    static async getComplaintTypes() {
        try {
            const response = await axios.get("http://localhost:8080/api/complaint/complaint-types")
            return response.data
        } catch (e) {
            console.log("Error fetching complaint types " + e)
        }
    }

    static async getLocalComplaintTypes() {
        try {
            const response = await axios.get("http://localhost:8080/api/complaint/local-complaint-types")
            return response.data
        } catch (e) {
            console.log("Error fetching complaint types " + e)
        }
    }

    static async changeResolvedStatusComplaint(complaintId) {
        axios
            .patch(`http://localhost:8080/api/complaint/${complaintId}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при удалении запроса:", error);
                alert("Произошла ошибка при удалении запроса.");
            });
    }

    static async changeResolvedStatusComplaintAndBlockUser(complaintId, resolveStatus) {
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/complaint-user/resolve-ban/${complaintId}`,
                null,
                {
                    params: {
                        resolveBanStatus: resolveStatus, // Передача параметра в запрос
                    },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error("Ошибка при изменении статуса блокировки:", error);
            alert("Произошла ошибка при изменении статуса блокировки.");
        }
    }

    static async getComplaintBannedUsers() {
        const response = await axios.get(`http://localhost:8080/api/complaint-user/banned-users`)
        return response.data
    }

    static async getAllUserComplaints(username) {
        try {
            const response = await axios.get(`http://localhost:8080/api/complaint/user/${username}`);
            console.log("Response data:", response.data);
            return response.data ? response.data : [];
        } catch (error) {
            console.error("Error in getAllUserSupports:", error);
            return [];
        }
    }

}