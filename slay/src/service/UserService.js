import axios from "axios";

export default class UserService {

    static async signUp(data) {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', data);
            console.log('Успех:', response);
            return response.data;
        } catch (err) {
            console.log(err.response.data.message);
            const errorMessage = document.getElementById('error-message');
            errorMessage.classList.remove('hidden');
            return err.response.data.message;
        }
    }
}