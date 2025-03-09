import React from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";
import useSnackbar from "@mui/material/Snackbar/useSnackbar";


const CourseBuyModalContent = ({
                                   handleSubmit,
                                   register,
                                   navigate,
                                   courseId,
                                   authStore
                               }) => {
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {
        if (authStore.authenticated) {

        } else {
            navigate("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <button type="submit" className="ym-btn-pay ym-result-price">
                <span className="ym-text-crop">Купить</span>
                <span className="ym-price-output"> 199,00&nbsp;₽</span>
            </button>
        </form>
    );
};

export default CourseBuyModalContent;