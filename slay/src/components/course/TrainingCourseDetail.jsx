import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import TrainingCourseService from '../../service/TrainingCourseService';
import VideoPlayer from '../VideoPlayer';
import CourseStepDetailVideoPlayer from "./CourseStepDetailVideoPlayer";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';

const TrainingCourseDetail = () => {
    const params = useParams();
    const [courseDetails, setCourseDetails] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    let [createAt, setCreateAt] = useState('');
    const [videosCount, setVideosCount] = useState(0);
    let [isPurchased, setPurchased] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false); // Стейт для управления состоянием меню
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await TrainingCourseService.getTrainingCourseById(params.id);
                setPurchased(!response.data.body.trainingCourseCroppedStep)
                console.log(isPurchased)

                setCourseDetails(response.data.body);
                console.log(response.data.body)
                setVideoUrl(response.data.body.trailer);
                setCreateAt(formatDate(response.data.body.createAt));

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

    // Функция для переключения состояния меню
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const deleteCourse = async (courseId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
            try {
                await TrainingCourseService.deleteCourseById(params.id);
                navigate("/")
            } catch (error) {
                console.log("Error delete course:", error);
            }
        }
    };

    return (
        <div className="main">
            <h1 className="course-detail-title">{courseDetails?.name}</h1>

            {/* Кнопка для открытия меню */}
            <button className="menu-toggle-btn" onClick={toggleMenu}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </button>

            {/* Меню */}
            <div className={`menu-card ${menuOpen ? 'open' : ''}`}>
                <ul className="menu-list">
                    <li className="menu-item">
                        <svg
                            className="menu-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7e8590"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                            ></path>
                            <path d="m15 5 4 4"></path>
                        </svg>
                        <p onClick={() => navigate(`/redact-course/${params.id}`)} className="menu-label">Redact</p>
                    </li>
                    <li className="menu-item">
                        <svg
                            className="menu-icon"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="#7e8590"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="24"
                            width="24"
                        >
                            <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                            <circle r="5" cy="8" cx="10"></circle>
                            <path d="M19 16v6"></path>
                            <path d="M22 19h-6"></path>
                        </svg>
                        <p className="menu-label">Add Member</p>
                    </li>
                </ul>
                <div className="menu-separator"></div>
                <ul className="menu-list">
                    <li onClick={() => deleteCourse(courseDetails.id)} className="menu-item delete">
                        <svg

                            className="menu-icon"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="#7e8590"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="24"
                            width="24"

                        >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line y2="17" y1="11" x2="10" x1="10"></line>
                            <line y2="17" y1="11" x2="14" x1="14"></line>
                        </svg>
                        <p
                            className="menu-label"
                        >
                            Delete
                        </p>
                    </li>
                </ul>
            </div>

            <div className="course-detail-info">
                {
                    courseDetails?.trailer
                        ? <VideoPlayer title={courseDetails?.name} videoUrl={videoUrl?.replace("download", "view")}/>
                        : <div className="trailer-no-video-block">
                            <span>
                                No video
                            </span>
                        </div>
                }
                <div className="card-author">
                    <header className="card-header">
                        <p>{createAt}</p>
                        <span className="card-author-title">{courseDetails?.name}</span>
                        <p className="card-author-description">{courseDetails?.description}</p>
                    </header>
                    <div className="card-author-info">
                        <a className="author-avatar" href="#">
                            <img src="/рарпаапр.PNG" alt="Author Avatar" className="avatar-image"/>
                            <span></span>
                        </a>
                        <svg className="half-circle" viewBox="0 0 106 57">
                            <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                        </svg>
                        <div className="author-name">
                            <span className="author-name-prefix">Author</span>
                            <span className="card-author-name"><Link
                                to={`/profile/${courseDetails.author}`}>{courseDetails?.author}</Link></span>
                        </div>
                    </div>
                    <div className="tags">
                        {courseDetails?.tags?.map((tag) => (
                            <a className="card-author-tag" href="#" key={tag.name}>
                                {tag.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="course-detail-material">
                <h1 className="course-detail-title">Информация</h1>
                <div className="material-info">
                    <div className="material-block">
                        <div className="material-info-block">
                            <div className="circle">
                                <img src="/ganteli.png" alt="" className="material-icon"/>
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
                                <img src="/ganteli.png" alt="" className="material-icon"/>
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

            {isPurchased ?
                <div className="course-steps-block">
                    {courseDetails?.trainingCourseSteps?.map((trainingCourseStep) =>
                        <div className="step-block" key={trainingCourseStep?.id}>
                            <h2 className="step-title"><h2 style={{
                                fontSize: '38px',
                                color: "#23c483",
                                display: 'inline-block'
                            }}>#</h2>  {trainingCourseStep?.title}</h2>

                            <span className="step-detail-description">{courseDetails.description}</span>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={1}
                                navigation={true}
                                pagination={{clickable: true}}
                                loop={false}
                                modules={[Navigation, Pagination]}
                                className="step-slider"

                                simulateTouch={false}  // Отключает возможность перемещения слайдов на мобильных устройствах
                                allowTouchMove={false} // Отключает перетаскивание слайдов
                                mousewheel={false}
                            >

                                {trainingCourseStep?.trainingCourseStepDetails?.map((stepDetail, index) => (
                                    <SwiperSlide key={index}>

                                        <div className="step-detail-block">
                                            <h2 className="step-detail-title">{stepDetail.title}</h2>
                                            <span className="step-detail-description">{stepDetail.description}</span>
                                            {
                                                stepDetail?.videos
                                                    ? <CourseStepDetailVideoPlayer
                                                        title={courseDetails?.description}
                                                        videoUrl={stepDetail?.videos?.replace("download", "view")}
                                                    />
                                                    : <div className="no-video-block">
                                                        <span>No video</span>
                                                    </div>
                                            }

                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
                :
                <div className="course-steps-block">
                    <div className="buy-btn-container">
                        <button className="btn-course-buy">
                            Купить за {courseDetails.price}$
                        </button>
                    </div>
                    <div className="course-blur-course-steps">
                        <div className="step-block">
                            <h2 className="step-title not-clickable"><h2 style={{
                                fontSize: '38px',
                                color: "#23c483",
                                display: 'inline-block'
                            }}>#</h2>  {courseDetails?.trainingCourseCroppedStep?.title}</h2>


                            <div className="step-detail-block">
                                <span
                                    className="step-detail-description not-clickable">{courseDetails?.trainingCourseCroppedStep?.description}</span>
                            </div>
                            <div className="course-steps-video not-clickable">
                                <VideoPlayer title={courseDetails?.name}
                                             videoUrl={videoUrl?.replace("download", "view")}/>
                            </div>
                        </div>

                    </div>
                </div>
            }

        </div>
    );
};

export default TrainingCourseDetail;
