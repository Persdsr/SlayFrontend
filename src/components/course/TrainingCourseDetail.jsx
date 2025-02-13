import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TrainingCourseService from '../../service/TrainingCourseService';
import VideoPlayer from '../player/VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import ComplaintCourseService from '../../service/ComplaintCourseService';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/store';
import LoadingPageIndicator from "../LoadingPageIndicator";

const TrainingCourseDetail = () => {
  const params = useParams();
  const [courseDetails, setCourseDetails] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  let [createAt, setCreateAt] = useState('');
  let [isPurchased, setPurchased] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintTypesMap, setComplaintTypesMap] = useState([]);
  const navigate = useNavigate();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const authStore = useAuthStore();
  const [requestResultText, setRequestResultText] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false)

  const openComplaintModal = (courseId) => {
    setShowComplaintModal(true);
  };

  const closeComplaintModal = () => {
    setShowComplaintModal(false);
    reset();
  };

  const openMessageDialog = () => {
    setShowMessageDialog(true);
  };

  const closeMessageDialog = () => {
    setShowMessageDialog(false);
  };

  const onSubmit = async (data) => {
    const messageBody = {
      message: data.message,
      receiver: courseDetails.author.username,
    };

    try {
      const responseChatId =
        await ComplaintCourseService.createChatAndFirstMessage(messageBody);
      navigate(`/message/${responseChatId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onComplaintSubmit = async (data) => {
    const complaintBody = {
      senderUsername: authStore.userData.username,
      reportedCourse: params.id,
      courseComplaintType: data.complaintRequestType,
      description: data.description,
    };

    try {
      const response =
        await ComplaintCourseService.createComplaintCourse(complaintBody);
      setRequestResultText(
        'Сomplaint has been successfully sent, you can close the window!'
      );
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setIsPageLoading(true)
    const fetchCourse = async () => {
      try {
        const response = await TrainingCourseService.getTrainingCourseById(
          params.id
        );
        setPurchased(!response.data.body.trainingCourseCroppedStep);

        const responseComplaintTypes =
          await ComplaintCourseService.getComplaintCourseTypes();
        setComplaintTypesMap(responseComplaintTypes);

        setCourseDetails(response.data.body);
        setVideoUrl(response.data.body.trailer);
        setCreateAt(formatDate(response.data.body.createAt));
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsPageLoading(false)
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const deleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await TrainingCourseService.deleteCourseById(params.id);
        navigate('/');
      } catch (error) {
        console.log('Error delete course:', error);
      }
    }
  };

  const handleByCourse = async () => {
    if (authStore.authenticated) {
      const response = await TrainingCourseService.handleByCourse(params.id)
      if (response.status === 200) {
        window.location.reload();
      }
    } else {
      navigate("/")
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="main">
      {
        isPageLoading ? (
            <LoadingPageIndicator />
        ) : (
            <div className="main-course-content">
              <h1 className="course-detail-title">{courseDetails?.name}</h1>

              <button className="menu-toggle-btn" onClick={toggleMenu}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </button>

              <div className={`menu-card ${menuOpen ? 'open' : ''}`}>
                {authStore?.userData?.roles.includes('ADMIN', 'MODERATOR') ||
                authStore?.userData?.username === courseDetails?.author?.username ? (
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
                              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>

                        <p
                            onClick={() => navigate(`/redact-course/${params.id}`)}
                            className="menu-label"
                        >
                          Redact
                        </p>
                      </li>
                    </ul>
                ) : (
                    ''
                )}
                <div className="menu-separator"></div>
                <ul className="menu-list">
                  {authStore?.userData?.roles.includes('ADMIN', 'MODERATOR') ||
                  authStore?.userData?.username === courseDetails?.author?.username ? (
                      <li
                          onClick={() => deleteCourse(courseDetails?.id)}
                          className="menu-item delete"
                      >
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
                        <p className="menu-label">Delete</p>
                      </li>
                  ) : (
                      ''
                  )}
                  <li onClick={() => openComplaintModal()} className="menu-item delete">
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
                    <p className="menu-label">Report</p>
                  </li>
                </ul>
              </div>

              <div className="course-detail-info">
                {courseDetails?.trailer ? (
                    <VideoPlayer
                        topTitle={`Trailer - ${courseDetails?.name}`}
                        videoUrl={videoUrl?.replace('download', 'view')}
                    />
                ) : (
                    <div className="trailer-no-video-block">
                      <span>No video</span>
                    </div>
                )}
                <div className="card-author">
                  <header className="card-header">
                    <p>{createAt}</p>
                    <span className="card-author-title">{courseDetails?.name}</span>
                    <p className="card-author-description">
                      {courseDetails?.description}
                    </p>
                  </header>
                  <div className="card-author-info">
                    <a className="author-avatar" href="#">
                      <img
                          src={courseDetails?.author?.avatar || "/defaultAvatar.jpg"}
                          className="avatar-image"
                      />
                      <span></span>
                    </a>
                    <svg className="half-circle" viewBox="0 0 106 57">
                      <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                    </svg>
                    <div className="author-name">
                      <span className="author-name-prefix">Author</span>
                      <span className="card-author-name">
                <Link to={`/profile/${courseDetails?.author?.username}`}>
                  {courseDetails?.author?.username}
                </Link>
              </span>
                    </div>
                    {isPurchased ? (
                        courseDetails?.chatting ? (
                            ''
                        ) : !authStore?.userData?.username === courseDetails?.author?.username ? (
                            <button onClick={openMessageDialog} className="btn-add-step">
                              Send message
                            </button>
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )}
                  </div>

                  <div className="tags">
                    {courseDetails?.tags?.map((tag) => (
                        <Link
                            className="card-author-tag"
                            to={`/search/${tag.name}`}
                            key={tag.name}
                        >
                          {tag.name}
                        </Link>
                    ))}
                  </div>
                </div>
              </div>

              {showMessageDialog && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>
                          Send message to <span>{courseDetails?.author}</span>
                        </h2>
                        <span className="close-button" onClick={closeMessageDialog}>
                ✖
              </span>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <label htmlFor="description" className="support-label">
                            message
                            <span style={{color: 'red', marginBottom: '5px'}}>*</span>
                          </label>
                          <textarea
                              {...register('message')}
                              className="support-area"
                              name="message"
                          />

                          <div className="modal-footer">
                            <div className="support-btn-block">
                              <button className="green-center-btn">Send</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              )}

              <div className="course-detail-material">
                <h1 className="course-detail-title">Information</h1>
                <div className="material-info">
                  <div className="material-block">
                    <div className="material-info-block">
                      <div className="circle">
                        <img src="/reviews-icon.png" alt="" className="material-icon"/>
                      </div>
                      <span className="material-description">
                Reviews: {courseDetails?.reviewsCount}
              </span>
                    </div>
                    <div className="material-info-block">
                      <div className="circle">
                        <img src="/dnevnikvideo.png" alt="" className="material-icon"/>
                      </div>
                      <span className="material-description">
                {`Material from ` + courseDetails?.videoCount + ' videos'}
              </span>
                    </div>
                    <div className="material-info-block">
                      <div className="circle">
                        <img src="/gym100.png" alt="" className="material-icon"/>
                      </div>
                      <span className="material-description">
                Course buyers: {courseDetails?.courseBuyers}
              </span>
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

              {isPurchased ? (
                  <div className="course-steps-block">
                    {courseDetails?.trainingCourseSteps?.map((trainingCourseStep) => (
                        <div className="step-block" key={trainingCourseStep?.id}>
                          <h2 className="step-title">
                            <h2
                                style={{
                                  fontSize: '38px',
                                  color: '#23c483',
                                  display: 'inline-block',
                                  fontFamily: 'sans-serif',
                                }}
                            >
                              #
                            </h2>{' '}
                            {trainingCourseStep?.title}
                          </h2>

                          <span className="step-detail-description">
                {courseDetails?.description}
              </span>
                          <Swiper
                              spaceBetween={20}
                              slidesPerView={1}
                              navigation={true}
                              pagination={{clickable: true}}
                              loop={false}
                              modules={[Navigation, Pagination]}
                              className="step-slider"
                              simulateTouch={false}
                              allowTouchMove={false}
                              mousewheel={false}
                          >
                            {trainingCourseStep?.trainingCourseStepDetails?.map(
                                (stepDetail, index) => (
                                    <SwiperSlide key={index}>
                                      <div className="step-detail-block">
                                        <h2 className="step-detail-title">
                                          {stepDetail.title}
                                        </h2>
                                        <span className="step-detail-description">
                          {stepDetail.description}
                        </span>
                                        {stepDetail?.videos ? (
                                            <VideoPlayer
                                                title={courseDetails?.description}
                                                videoUrl={stepDetail?.videos?.replace(
                                                    'download',
                                                    'view'
                                                )}
                                            />
                                        ) : (
                                            <div className="no-video-block">
                                              <span>No video</span>
                                            </div>
                                        )}
                                      </div>
                                    </SwiperSlide>
                                )
                            )}
                          </Swiper>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="course-steps-block">
                    <div className="buy-btn-container">
                      <button onClick={handleByCourse} className="btn-course-buy">
                        buy for {courseDetails?.price}$
                      </button>
                      <span data-tooltip={"После покупки вы можете найти курс во вкладе 'Купленные курсы'"}>
            <img className="course-buy-info" src="/icon-info.png" alt=""/>
          </span>
                    </div>

                    <div className="course-blur-course-steps">
                      <div className="step-block">
                        <h2 className="step-title not-clickable">
                          <h2
                              style={{
                                fontSize: '38px',
                                color: '#23c483',
                                display: 'inline-block',
                              }}
                          >
                            #
                          </h2>{' '}
                          {courseDetails?.trainingCourseCroppedStep?.title}
                        </h2>

                        <div className="step-detail-block">
                <span className="step-detail-description not-clickable">
                  {courseDetails?.trainingCourseCroppedStep?.description}
                </span>
                        </div>
                        <div className="course-steps-video not-clickable">
                          <VideoPlayer
                              title={courseDetails?.name}
                              videoUrl={videoUrl?.replace('download', 'view')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {showComplaintModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>Report</h2>
                        <span className="close-button" onClick={closeComplaintModal}>
                ✖
              </span>
                      </div>
                      {requestResultText && (
                          <div className="request-result-block">
                            <span className="request-result-text">{requestResultText}</span>
                          </div>
                      )}

                      <div className="modal-body">
                        <form onSubmit={handleSubmit(onComplaintSubmit)}>
                          <div className="input-simple-wrapper">
                            <label htmlFor="requestType" className="support-label">
                              Report type<span style={{color: 'red'}}>*</span>
                            </label>
                            <select
                                name="requestType"
                                className="simple-input"
                                {...register('complaintRequestType')}
                            >
                              <option value="" disabled selected>
                                Pick support type
                              </option>
                              {Object.entries(complaintTypesMap).map(([value, label]) => (
                                  <option value={value}>{label}</option>
                              ))}
                            </select>
                          </div>

                          <label htmlFor="description" className="support-label">
                            Description
                            <span style={{color: 'red', marginBottom: '5px'}}>*</span>
                          </label>
                          <textarea
                              {...register('description')}
                              className="support-area"
                              name="description"
                          />

                          <div className="modal-footer">
                            <div className="support-btn-block">
                              <button className="green-center-btn">Send</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              )}
            </div>
        )
      }
    </div>
  );
};

export default TrainingCourseDetail;
