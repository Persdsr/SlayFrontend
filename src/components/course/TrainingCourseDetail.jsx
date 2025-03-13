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
import Modal from "../modal/Modal"
import ComplaintModalContent from "../modal/ComplaintModalContent";
import MessageModalContent from "../modal/MessageModalContent";
import ReviewModalContent from "../modal/ReviewModalContent";
import ModalPayment from "../modal/ModalPayment";
import CourseBuyModalContent from "../modal/CourseBuyModalContent";

const TrainingCourseDetail = () => {
  const params = useParams();
  const [courseDetails, setCourseDetails] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  let [createAt, setCreateAt] = useState('');
  let [isPurchased, setPurchased] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setPaymentShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalPaymentContent, setPaymentModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPaymentTitle, setPaymentModalTitle] = useState('');
  const [complaintTypesMap, setComplaintTypesMap] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset, formState: {
    errors
  }} = useForm();
  const authStore = useAuthStore();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    reset();
  };



  useEffect(() => {
    setIsPageLoading(true);
    const fetchCourse = async () => {
      try {
        const response = await TrainingCourseService.getTrainingCourseById(
            params.id
        );
        setPurchased(!response.data.trainingCourseCroppedStep);

        const responseComplaintTypes =
            await ComplaintCourseService.getComplaintCourseTypes();
        setComplaintTypesMap(responseComplaintTypes);

        setCourseDetails(response.data);
        setVideoUrl(response.data.trailer);
        setCreateAt(formatDate(response.data.createAt));
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsPageLoading(false);
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

  const handleBuyCourse = async (event) => {
    event.preventDefault();

    const data = {
      courseId: params.id,
      buyerUsername: authStore?.userData?.username,
      price: courseDetails?.price
    };

    try {
      const response = await fetch('https://24slay.ru/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        window.location.href = result.confirmation.confirmation_url;
      } else {
        console.error('Ошибка при создании платежа:', responseText);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
      <div className="main">
        {isPageLoading ? (
            <LoadingPageIndicator />
        ) : (
            <div className="main-course-content">
              <h1 className="course-detail-title">{courseDetails?.name}</h1>
              

              {
                authStore.authenticated ? (
                        <button className="menu-toggle-btn" onClick={toggleMenu}>
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </button>
                    ) :
                    ""
              }
              <div className={`menu-card ${menuOpen ? 'open' : ''}`}>
                <ul className="menu-list">
                  {authStore?.userData?.roles.includes('ADMIN', 'MODERATOR') ||
                  authStore?.userData?.username === courseDetails?.author?.username ? (
                      <li className="menu-item" onClick={() => navigate(`/redact-course/${params.id}`)}>
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
                            className="menu-label"
                        >
                          Redact
                        </p>
                      </li>


                  ) : (
                      ''
                  )}
                  {
                    isPurchased ? (
                            <li className="menu-item" onClick={() => openModal("Send review",
                                <ReviewModalContent
                                    handleSubmit={handleSubmit}
                                    register={register}
                                    errors={errors}
                                    trainingCourseId={params.id}
                                    reset={reset}
                                />)}>
                              <img className="menu-icon" width="25"
                                   height="25" src="/reviews-icon.png" alt=""/>

                              <p
                                  className="menu-label"
                              >
                                Send review
                              </p>
                            </li>
                        ) :
                        ''
                  }
                </ul>
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
                  <li onClick={() => openModal('Report',
                      <ComplaintModalContent
                          complaintTypesMap={complaintTypesMap}
                          handleSubmit={handleSubmit}
                          params={params}
                          reset={reset}
                          senderUsername={authStore.userData.username}
                          register={register}
                      />)

                  } className="menu-item delete">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <line y2="9" y1="9" x2="12" x1="12"></line>
                      <line y2="13" y1="13" x2="12" x1="12"></line>
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
                    {/*{isPurchased ? (
                        courseDetails?.chatting ? (
                            ''
                        ) : authStore?.userData?.username === courseDetails?.author?.username ? (
                            ''
                        ) : (
                            <button onClick={() => openModal('Send Message',
                                <MessageModalContent
                                    register={register}
                                    handleSubmit={handleSubmit}
                                    navigate={navigate}
                                    authorUsername={courseDetails.author.username}
                                />)} className="btn-add-step">
                              Send message
                            </button>
                        )
                    ) : (
                        ''
                    )}*/}
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

              {showModal && (
                  <Modal
                      title={modalTitle}
                      content={modalContent}
                      onClose={closeModal}
                  />
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
                      <span className="material-description">-</span>
                    </div>
                    <div className="material-info-block">
                      <div className="circle">
                        <img src="/dnevnikvideo.png" alt="" className="material-icon"/>
                      </div>
                      <span className="material-description">-</span>
                    </div>
                    <div className="material-info-block">
                      <div className="circle">
                        <img src="/gym100.png" alt="" className="material-icon"/>
                      </div>
                      <span className="material-description">-</span>
                    </div>
                  </div>
                </div>
              </div>

              {isPurchased ? (
                  <div className="course-steps-block">
                    {courseDetails?.trainingCourseSteps?.map((trainingCourseStep, index) => (
                        <div className="step-block" key={index}>
                          <h2 className="step-title">
  <span style={{fontSize: '38px', color: '#23c483', display: 'inline-block'}}>
    #
  </span>{' '}
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
                      <form onSubmit={handleBuyCourse} method="post">
                        <input name="courseId" type="hidden" value={courseDetails.id}/>
                        <input name="buyerUsername" type="hidden" value={authStore?.userData?.username}/>
                        <input name="price" type="hidden" value={courseDetails.price}/>

                        <button type="submit" className="btn-course-buy">
                          <span>Купить</span> <span className="ym-price-output"> {courseDetails.price}&nbsp;₽</span>
                        </button>
                      </form>

                      <span data-tooltip={"После покупки вы можете найти курс во вкладе 'Купленные курсы'"}>
            <img className="course-buy-info" src="/icon-info.png" alt=""/>
        </span>
                    </div>


                    <div className="course-blur-course-steps">
                      <div className="step-block">
                        <h2 className="step-title not-clickable">
                          <span style={{fontSize: '38px', color: '#23c483', display: 'inline-block'}}>
                            #
                          </span>{' '}
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
            </div>
        )}
      </div>
  );
};

export default TrainingCourseDetail;