import React, { useEffect, useState } from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";
import CategoryTagListItem from "./CategoryTagListItem";

const CategoriesList = () => {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        const fetchCategoriesWithCourses = async () => {
            const response = await TrainingCourseService.getCategoriesWithCourses();
            setCategories(response.data.categories);
            setTags(response.data.tags);
        };

        fetchCategoriesWithCourses();
    }, []);

    return (
        <div>
            <button className="icon-btn add-btn">
                <div className="add-icon"></div>
                <div className="btn-txt">Создать курс</div>
            </button>
            {
                categories.map((category) => (
                    category.trainingCourses.length > 0 ?
                    <CategoryTagListItem category={category} />
                        : ""
                ))
            }
            {
                tags.map((tag) => (
                    tag.trainingCourses.length > 0 ?
                    <CategoryTagListItem category={tag} />
                        : ""
                ))
            }
        </div>
    );
};

export default CategoriesList;
