import axios from "axios";

export default class ComplaintUserService {

    static async getComplaintUserById(complaintId) {
        const response = await axios.get("http://localhost:8080/api/complaint-user/" + complaintId,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            }
            )
        return response.data;
    }
}