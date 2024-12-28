import React, { useEffect, useState } from 'react';
import CategoryTrainingCourseItem from "../../course/CategoryTrainingCourseItem";

const ComplaintCourseItem = ({ complaint }) => {
    const [course, setCourse] = useState(null); // Начальное состояние null

    useEffect(() => {
        if (complaint && complaint.course) {
            setCourse(complaint.course); // Обновляем состояние, если данные есть
        }
    }, [complaint]); // Зависимость от изменения complaint

    if (!course) {
        return <div>Загрузка курса...</div>; // Показываем загрузку, если данные отсутствуют
    }

    return (
        <div>
            <h2 className="complaint-detail-title">Курс</h2>
            <CategoryTrainingCourseItem course={course} />
        </div>
    );
};

export default ComplaintCourseItem;
