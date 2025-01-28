import axios from "axios";

export default class ComplaintUserService {

    static async getComplaintUserById(complaintId) {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/complaint-user/` + complaintId,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            }
            )
        return response.data;
    }
}