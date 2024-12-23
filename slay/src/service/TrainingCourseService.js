import axios from "axios";

export default class TrainingCourseService {

    static async getTrainingCourseById(id) {
        return await axios.get("http://localhost:8080/api/training-course/detail/" + id);
    }

    static async getAuthorTrainingCourses(username) {
        return await axios.get("http://localhost:8080/api/training-course/author/" + username);
    }

    static async getSportCategoriesName() {
        return await axios.get("http://localhost:8080/api/category/categories-name");
    }

    static async getCategoriesWithCourses() {
        return await axios.get("http://localhost:8080/api/category/training-courses");
    }

    static async deleteCourseById(id) {
        return await axios.delete("http://localhost:8080/api/training-course/" + id)
    }

    static async updateTrainingCourseBybFields(id, fields) {
        return await axios.patch(`http://localhost:8080/api/training-course/update-fields/${id}`, fields);
    }

    static async getAllCategoriesNames() {
        return await axios.get("http://localhost:8080/api/category/categories-name")
    }
}