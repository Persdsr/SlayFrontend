import axios from "axios";


export default class AdminService {

    static async getAllSortedByDateSupports() {
        const response = await axios.get("http://localhost:8080/api/support",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            })
        return response.data.sort((a, b) =>
            new Date(b.createAt) - new Date(a.createAt));
    }


}