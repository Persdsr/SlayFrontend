import axios from "axios";

export default class ReviewService {

    static async deleteReviewById(reviewId) {
        return await axios.delete(`http://localhost:8080/api/training-course/review/${reviewId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }})
    }
}