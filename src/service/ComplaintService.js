import axios from "axios";

export default class ComplaintService {

    static async getAllSortedByDateComplaint() {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/complaint`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }}
            );
        return response.data.sort((a, b) =>
            new Date(b.createAt) - new Date(a.createAt)
        );

    }

    static async getComplaintDetailById(complaintId) {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/complaint/` + complaintId,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            })
        return response.data.body;
    }

    static async getComplaintTypes() {
        try {
            const response = await axios.get(`${process.env.API_BASE_URL}/api/complaint/complaint-types`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                })
            return response.data
        } catch (e) {
            console.log("Error fetching complaint types " + e)
        }
    }

    static async getLocalComplaintTypes() {
        try {
            const response = await axios.get(`${process.env.API_BASE_URL}/api/complaint/local-complaint-types`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                })
            return response.data
        } catch (e) {
            console.log("Error fetching complaint types " + e)
        }
    }

    static async changeResolvedStatusComplaint(complaintId) {
        axios
            .patch(
                `${process.env.API_BASE_URL}/api/complaint/${complaintId}`,
                {}, // Пустое тело, так как данные не передаются
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
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

    static async getComplaintBannedUsers() {
        return await axios.get(`${process.env.API_BASE_URL}/api/complaint-user/banned-users`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            })
    }

    static async getAllUserComplaints() {
        try {
            const response = await axios.get(`${process.env.API_BASE_URL}/api/complaint/user`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
                );
            console.log("Response data:", response.data);
            return response.data ? response.data : [];
        } catch (error) {
            console.error("Error in getAllUserSupports:", error);
            return [];
        }
    }

}