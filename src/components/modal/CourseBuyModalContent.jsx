import React from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";

const CourseBuyModalContent = ({
                                   handleSubmit,
                                   register,
                                   navigate,
                                   courseId,
                                   authStore
                               }
) => {

    const onSubmit = async () => {
        if (authStore.authenticated) {
            const response = await TrainingCourseService.handleByCourse(courseId);
            if (response.status === 200) {
                window.location.reload();
            }
        } else {
            navigate("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

        </form>
    );
};

export default CourseBuyModalContent;