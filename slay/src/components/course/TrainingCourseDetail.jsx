import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrainingCourseService from '../../service/TrainingCourseService';
import VideoPlayer from '../VideoPlayer';
import CourseStepDetailVideoPlayer from "./CourseStepDetailVideoPlayer";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


const TrainingCourseDetail = () => {
    const params = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    let [createAt, setCreateAt] = useState('');
    const [videosCount, setVideosCount] = useState(0);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await TrainingCourseService.getTrainingCourseById(params.id);
                setCourseDetails(response.data);
                setVideoUrl(response.data.trailer);
                setCreateAt(formatDate(response.data.createAt));

                const countVideos = response.data.trainingCourseSteps.reduce((acc, step) => {
                    return acc + step.trainingCourseStepDetails.filter(detail => detail.videos).length;
                }, 0);

                setVideosCount(countVideos);

            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [params.id]);

    function formatDate(isoString) {
        const date = new Date(isoString);
        const days = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = String(date.getUTCFullYear()).padStart(2, '0');
        return `${days}-${month}-${year}`;
    }

    return (
        <div className="main">
            <h1 className="course-detail-title">{courseDetails?.name}</h1>
            <div className="course-detail-info">
                <VideoPlayer title={courseDetails?.name} videoUrl={videoUrl.replace("download", "view")} />
                <div className="card-author">
                    <header className="card-header">
                        <p>{createAt}</p>
                        <span className="card-author-title">{courseDetails?.name}</span>
                        <p className="card-author-description">{courseDetails?.description}</p>
                    </header>

                    <div className="card-author-info">
                        <a className="author-avatar" href="#">
                            <span></span>
                        </a>
                        <svg className="half-circle" viewBox="0 0 106 57">
                            <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                        </svg>
                        <div className="author-name">
                            <span className="author-name-prefix">Author</span>
                            <span className="card-author-name">{courseDetails?.author}</span>
                        </div>
                    </div>
                    <div className="tags">
                        {courseDetails?.categories.map((category) =>
                            <a className="card-author-tag" href="#" key={category}>{category}</a>
                        )}
                    </div>
                </div>
            </div>
            <div className="course-detail-material">
                <h1 className="course-detail-title">Информация</h1>
                <div className="material-info">
                    <div className="material-block">
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/ganteli.png" alt="" className="material-icon" />
                            </div>
                            <span className="material-description">uuh</span>
                        </div>
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/dnevnikvideo.png" alt="" className="material-icon"/>
                            </div>
                            <span className="material-description">{`Материал из ` + videosCount + " видео"}</span>
                        </div>
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/gym100.png" alt="" className="material-icon"/>
                            </div>
                            <span className="material-description">Course buyers: 3</span>
                        </div>
                    </div>
                    <div className="material-block">
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/ganteli.png" alt="" className="material-icon" />
                            </div>
                            <span className="material-description">uuh</span>
                        </div>
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/dnevnikvideo.png" alt="" className="material-icon"/>
                            </div>
                            <span className="material-description">{`Изображения: `}</span>
                        </div>
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/gym100.png" alt="" className="material-icon"/>
                            </div>
                            <span className="material-description">Course buyers: 3</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="course-steps-block">
                {courseDetails?.trainingCourseSteps.map((trainingCourseStep) =>
                    <div className="step-block" key={trainingCourseStep?.id}>
                        <h2 className="step-title"><h2 style={{fontSize: '38px', color: "#23c483", display: 'inline-block'}}>#</h2>  {trainingCourseStep?.title}</h2>

                        {/* Swiper для слайдера */}
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation={true}  // Навигация включена
                            pagination={{ clickable: true }}
                            loop={false} // Отключаем бесконечный цикл
                            modules={[Navigation, Pagination]}  // Указываем модули здесь
                            className="step-slider"

                            simulateTouch={false}  // Отключает возможность перемещения слайдов на мобильных устройствах
                            allowTouchMove={false} // Отключает перетаскивание слайдов
                            mousewheel={false} // Отключает прокрутку колесиком мыши
                        >
                            {trainingCourseStep?.trainingCourseStepDetails.map((stepDetail, index) => (
                                <SwiperSlide key={index}>
                                    <div className="step-detail-block">
                                        <span className="step-detail-description">{stepDetail.description}</span>
                                        <CourseStepDetailVideoPlayer
                                            title={courseDetails?.description}
                                            videoUrl={stepDetail?.videos.replace("download", "view")}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingCourseDetail;
