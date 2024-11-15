import React, { useEffect, useState } from 'react';
import TrainingCourseService from "../service/TrainingCourseService";

const CategoriesList = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategoriesWithCourses = async () => {
            const response = await TrainingCourseService.getCategoriesWithCourses();
            setCategories(response.data); // обновляем состояния с новыми данными
        };

        fetchCategoriesWithCourses();
    }, []); // Пустой массив зависимостей (означает, что useEffect выполнится только при монтировании компонента)

    return (
        <div>
            {
                categories.map((category) => (
                    <div className="category-courses" key={category.id}> {/* добавлен ключ для элементов списка */}
                        <h2 className="category-name">{category.name}</h2>
                        <div className="courses-container">
                            {
                                category.trainingCourses.map((course) => (
                                    <div className="course-block">
                                        <a href={`/course/detail/${1}`}>
                                            <img className="course-poster" src={course.poster} alt=""/>
                                        </a>
                                        <div className="catalog-author-info">
                                            <div className="course-avatar-block">
                                                <a className="catalog-author-avatar" href="#">
                                                <span>
                                                    <img className="catalog-author-avatar"
                                                         src="https://steamuserimages-a.akamaihd.net/ugc/782989521799828488/99CC5CFF94186C28A21C7E81D145E9C6550DCC14/?imw=512&amp;imh=499&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true"
                                                         alt=""/>
                                                </span>
                                                </a>
                                                <svg className="catalog-half-circle" viewBox="0 0 106 57">
                                                    <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                                                </svg>
                                            </div>
                                            <div className="author-name">
                                                <span className="course-name">{course.name} аыва аыуавууууу ууууууы ауауаау</span>
                                                <span className="card-author-name">{course?.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <br/>
                    </div>
                ))
            }
        </div>
    );
};

export default CategoriesList;
