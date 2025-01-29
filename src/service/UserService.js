import axios from "axios";

export default class UserService {

    static async signUp(data) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, data);
            console.log('Успех:', response);
            return response.data;
        } catch (err) {
            console.log(err.response.data.message);
            const errorMessage = document.getElementById('error-message');
            errorMessage.classList.remove('hidden');
            return err.response.data.message;
        }
    }

    static async followToUser(followBody) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/follow`,
                followBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }}
            );
            console.log(response.status)
            console.log('Успех:', response);
            return response;
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    static async unFollowToUser(followBody) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/unfollow`,
                followBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }}
            );
            console.log('Успех:', response);
            return response;
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    static async updateUserData(formData) {
            const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update_user_fields`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }}
                )
            return response
    }

    static async getUserProfileData() {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
        return response
    }

    static async getUserPurchaseCourses() {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/purchase-courses`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            }
            )
        return response
    }
}