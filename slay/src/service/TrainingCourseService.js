import axios from "axios";

export default class TrainingCourseService {

    static async getTrainingCourseById(id) {
        return await axios.get("http://localhost:8080/api/training-course/detail/" + id);
    }

    static async getSportCategoriesName() {
        return await axios.get("http://localhost:8080/api/category/categories-name");
    }

    static async getMoviesByGenre(genre) {
        return await axios.get("http://localhost:8080/api/genre/" + genre);
    }

    static async getLastTwoBigMovies() {
        return await axios.get("http://localhost:8080/api/lasttwo");
    }
}