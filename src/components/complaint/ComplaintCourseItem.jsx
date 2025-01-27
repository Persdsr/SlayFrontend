import React, { useEffect, useState } from 'react';
import CategoryTrainingCourseItem from "../course/CategoryTrainingCourseItem";

const ComplaintCourseItem = ({ complaint }) => {
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (complaint && complaint.course) {
            setCourse(complaint.course);
        }
    }, [complaint]);

    if (!course) {
        return <div>Загрузка курса...</div>;
    }

    return (
        <div>
            <h2 className="complaint-detail-title">Курс</h2>
            <CategoryTrainingCourseItem course={course} />
        </div>
    );
};

export default ComplaintCourseItem;
