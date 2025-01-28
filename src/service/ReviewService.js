import axios from "axios";

export default class ReviewService {

    static async deleteReviewById(reviewId) {
        return await axios.delete(`${process.env.API_BASE_URL}/api/training-course/review/${reviewId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }})
    }
}