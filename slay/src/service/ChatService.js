import axios from "axios";

export default class ChatService {

    static async getChats() {
        try {
            const response = await axios.get('http://localhost:8080/api/chat',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }}
                );
            console.log('Успех:', response);
            return response.data;
        } catch (err) {
            console.log(err.response.data.message);

        }
    }

    static async getChatDetailById(chatId) {
        try {
            const response = await axios.get('http://localhost:8080/api/chat/c/' + chatId,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }}
            );
            console.log('Успех:', response);
            return response.data;
        } catch (err) {
            console.log(err.response.data.message);

        }
    }

}