import axios from "axios";

export default class TrainingCourseService {

    static async getTrainingCourseById(id) {
        return await axios.get("http://localhost:8080/api/training-course/detail/" + id);
    }

    static async getSportCategoriesName() {
        return await axios.get("http://localhost:8080/api/category/categories-name");
    }

    static async getCategoriesWithCourses() {
        return await axios.get("http://localhost:8080/api/category/training-courses");
    }
}