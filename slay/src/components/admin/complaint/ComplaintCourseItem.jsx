import React, {useEffect, useState} from 'react';
import CategoryTrainingCourseItem from "../../course/CategoryTrainingCourseItem";

import ComplaintService from "../../../service/ComplaintService";
import ComplaintCourseService from "../../../service/ComplaintCourseService";

const ComplaintCourseItem = ({complaint}) => {
    const [course, setCourse] = useState([])

    useEffect(() => {

        const fetchCourse = async () => {
            const response = await ComplaintCourseService.getComplaintCourseDetailById(complaint.id)
            setCourse(response.course)

        }
        fetchCourse()

    }, []);

    return (
        <div>
            <h2 className="complaint-detail-title">Курс</h2>
            <CategoryTrainingCourseItem course={course}/>
        </div>
    );
};

export default ComplaintCourseItem;