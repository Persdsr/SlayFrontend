import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TrainingCourseService from '../../service/TrainingCourseService';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import ComplaintCourseService from '../../service/ComplaintCourseService';
import { useAuthStore } from '../store/store';
import UserService from '../../service/UserService';
import UserLeftToolbar from '../navbar/UserLeftToolbar';
import ReviewService from '../../service/ReviewService';
import LoadingIndicator from '../LoadingIndicator';

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState('');
  const [menuReviewOpen, setMenuReviewOpen] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [complaintTypesMap, setComplaintTypesMap] = useState([]);
  const [requestResultText, setRequestResultText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const params = useParams();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  const openMessageDialog = () => {
    setShowMessageDialog(true);
  };

  const closeMessageDialog = () => {
    setShowMessageDialog(false);
  };

  const openUnfollowDialog = () => {
    setShowUnfollowDialog(true);
  };

  const closeUnfollowDialog = () => {
    setShowUnfollowDialog(false);
  };

  const toggleMenu = (name) => {
    setMenuOpen(menuOpen === name ? null : name);
  };

  const toggleReviewMenu = (reviewId) => {
    setMenuReviewOpen(menuReviewOpen === reviewId ? null : reviewId);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await TrainingCourseService.getAuthorTrainingCourses(
          params?.username
        );
        setData(response.data);
        const responseComplaintTypes =
          await ComplaintCourseService.getComplaintCourseTypes();
        setComplaintTypesMap(responseComplaintTypes);
        setLoading(false);
      } catch (e) {
        navigate('/*');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.username, navigate]);

  const deleteCourse = async (courseId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      try {
        await TrainingCourseService.deleteCourseById(courseId);
        window.location.reload();
      } catch (error) {
        console.log('Error delete course:', error);
      }
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await ReviewService.deleteReviewById(reviewId);
        window.location.reload();
      } catch (error) {
        console.log('Error delete review:', error);
      }
    }
  };

  const startEditing = (course) => {
    setEditCourseId(course.id);
    setEditedDescription(course.description);
  };

  const saveChanges = async (courseId) => {
    try {
      await TrainingCourseService.updateTrainingCourseByFields(courseId, {
        description: editedDescription,
      });
      const updatedCourses = data.courses.map((course) =>
        course.id === courseId
          ? { ...course, description: editedDescription }
          : course
      );
      setData(updatedCourses);
      setEditCourseId(null);
      window.location.reload();
    } catch (error) {
      console.log('Error updating course:', error);
    }
  };

  const openComplaintModal = (courseId) => {
    setSelectedCourseId(courseId);
    setShowComplaintModal(true);
  };

  const closeComplaintModal = () => {
    setShowComplaintModal(false);
    reset();
  };

  const onSubmit = async (data) => {
    const complaintBody = {
      senderUsername: authStore.userData.username,
      reportedCourse: selectedCourseId,
      courseComplaintType: data.complaintRequestType,
      description: data.description,
    };

    try {
      const response =
        await ComplaintCourseService.createComplaintCourse(complaintBody);
      setRequestResultText('The complaint has been successfully sent, you can close the window.');
      reset();
    } catch (error) {
      console.error('Ошибка отправки жалобы:', error);
    }
  };

  const onMessageSubmit = async (messageData) => {
    const messageBody = {
      message: messageData.message,
      receiver: data.author.username,
    };

    console.log(messageBody);

    try {
      const responseChatId =
        await ComplaintCourseService.createChatAndFirstMessage(messageBody);
      navigate(`/message/${responseChatId}`);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  const onFollowSubmit = async () => {
    const formData = new FormData();
    formData.append('author', data?.author?.username);
    console.log(formData);
    try {
      const response = await UserService.followToUser(formData);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Ошибка отправки жалобы:', error);
    }
  };

  const unFollowSubmit = async () => {
    const formData = new FormData();
    formData.append('author', data?.author?.username);

    try {
      const response = await UserService.unFollowToUser(formData);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Ошибка отправки жалобы:', error);
    }
  };

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="content-container">
      <UserLeftToolbar authStore={authStore} />

      <div className="profile-block">
        <div className="banner-container">
          <img
            className="profile-banner"
            src={
              data?.author?.banner
                ? data.author.banner
                : '/white-background.jpeg'
            }
            alt="Profile Banner"
          />

          {data.subscribed ? (
            <div className="profile-btns">
              {data.buyer ? (
                data.chatId ? (
                  <button
                    onClick={() => navigate(`/message/${data.chatId}`)}
                    className="profile-write"
                  >
                    Send message
                  </button>
                ) : (
                  <button onClick={openMessageDialog} className="profile-write">
                    Send message
                  </button>
                )
              ) : (
                ''
              )}

              <button
                className="profile-unfollow-btn"
                onClick={openUnfollowDialog}
              >
                Followed
              </button>

              {showUnfollowDialog && (
                <div className="dialog-overlay">
                  <div className="dialog-content">
                    <p>Are you sure you want to unsubscribe?</p>
                    <div className="dialog-actions">
                      <button
                        onClick={unFollowSubmit}
                        className="dialog-confirm-btn"
                        type={'submit'}
                      >
                        Unfollow
                      </button>
                      <button
                        className="dialog-cancel-btn"
                        onClick={closeUnfollowDialog}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-btns">
              {data.buyer ? (
                data.chatId ? (
                  <button
                    onClick={() => navigate(`/message/${data.chatId}`)}
                    className="profile-write"
                  >
                    Send message
                  </button>
                ) : (
                  <button onClick={openMessageDialog} className="profile-write">
                    Send message
                  </button>
                )
              ) : (
                ''
              )}

              <button
                onClick={onFollowSubmit}
                type={'submit'}
                className="profile-follow"
              >
                Follow
              </button>
            </div>
          )}
        </div>

        {showMessageDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  Send message to <span>{data?.author.username}</span>
                </h2>
                <span className="close-button" onClick={closeMessageDialog}>
                  ✖
                </span>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(onMessageSubmit)}>
                  <label htmlFor="description" className="support-label">
                    message
                    <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    className="support-area"
                    name="message"
                  />

                  <div className="modal-footer">
                    <div className="support-btn-block">
                      <button className="support-btn">Send</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="avatar-container">
          <img
            className="profile-avatar"
            src={data?.author?.avatar || '/defaultAvatar.jpg'}
          />
          <div className="profile-user-info">
            <span className="profile-user-info-name">{data?.author?.name}</span>
            <span className="profile-user-name">@{data?.author?.username}</span>
          </div>
          <span className="profile-user-description">
            {data?.author?.aboutMe}
          </span>
        </div>
        <div className="profile-chanel-info">
          <span data-tooltip="Followers">
            <img src="/followers%20(2).png" alt="" />
            {data.author.followersCount}
          </span>
          <span data-tooltip="Reviews">
            <img src="/reviews-icon.png" alt="" />
            {data.reviewsCount}
          </span>
        </div>
        {data?.courses?.length > 0 ? (
          <div className="profile-user-content">
            <div className="profile-user-training-courses">
              {data?.courses?.map((course) => (
                <div className="user-training-course-block" key={course.id}>
                  <div className="user-training-course-info">
                    <img src={data?.author?.avatar} alt="" />
                    <div>
                      <span className="course-author-name">
                        {course?.author.username}
                      </span>
                      <span className="course-author-user-name">
                        @{course?.author.username}
                      </span>
                    </div>
                    <span className="user-training-course-createAt">
                      {format(new Date(course.createAt), 'dd.MM.yyyy')}
                    </span>

                    <div className="profile-menu-container">
                      <button
                        className={`profile-menu-trigger`}
                        onClick={() => toggleMenu(course.name)}
                      >
                        <span className="profile-menu-dot"></span>
                        <span className="profile-menu-dot"></span>
                        <span className="profile-menu-dot"></span>
                      </button>
                      {menuOpen === course.name && (
                        <ul className="profile-menu-dropdown">
                          <li onClick={() => deleteCourse(course.id)}>
                            Delete
                          </li>
                          <li onClick={() => startEditing(course)}>Redact</li>
                          <li onClick={() => openComplaintModal(course.id)}>
                            Report
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

                  {editCourseId === course.id ? (
                    <div className="user-training-course-edit">
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                      <button onClick={() => saveChanges(course.id)}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="user-training-course-description">
                      {course.description}
                    </span>
                  )}

                  <div className="user-training-course-poster-block">
                    <img src={course.poster} alt="" />
                    <div className="poster-overlay">
                      <h2>{course.name}</h2>
                      <Link to={`/course/${course.id}`}>
                        <button className="purchase-button">
                          Go to description
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-course-block">
            <h1>No courses</h1>
            <Link to={'/create-course'} className="center-tip">
              Create
            </Link>
          </div>
        )}
      </div>

      <div className="profile-reviews-container">
        {data?.reviews?.map((review, index) => (
          <div key={index} className="profile-review-block">
            <div className="review-author-info">
              <img
                className="review-author-avatar"
                src={review?.author?.avatar || '/defaultAvatar.jpg'}
                alt="Author Avatar"
              />
              <div className="review-info">
                <span className="review-author">
                  {review?.author?.username}
                </span>
                <div className="star-container">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <img
                      key={index}
                      className="star-review"
                      src="/star.png"
                      alt="Star"
                    />
                  ))}
                </div>
                <span className="review-course-description">
                  Курс:{' '}
                  <a href={`/course/${review.course.id}`}>
                    {review.course.name}
                  </a>
                </span>
              </div>
              <div className="review-menu">
                <div className="profile-menu-container">
                  <button
                    className={`profile-menu-trigger`}
                    onClick={() => toggleReviewMenu(review?.id)}
                  >
                    <span className="profile-menu-dot"></span>
                    <span className="profile-menu-dot"></span>
                    <span className="profile-menu-dot"></span>
                  </button>
                  {menuReviewOpen === review?.id && (
                    <ul className="profile-menu-dropdown">
                      <li onClick={() => deleteReview(review?.id)}>Delete</li>
                      <li
                        onClick={() =>
                          console.log('Change review', review?.id)
                        }
                      >
                        Redact
                      </li>
                      {/* <li onClick={() => openComplaintModal(review.id)}>Пожаловаться</li>*/}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="review-content">
              <span className={'profile-review-title'}>{review.title}</span>
              <span className="profile-review-description">{review.text}</span>
            </div>
            <div className="review-images">
              {review.images?.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`Review Image ${imgIndex + 1}`}
                  className="review-image"
                  onClick={() => openImageModal(image)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showImageModal && (
        <div className="review-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content">
            <img src={selectedImage} />
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-simple-wrapper">
                  <label htmlFor="requestType" className="support-label">
                    Report type<span style={{ color: 'red' }}>*</span>
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
                  <span style={{ color: 'red', marginBottom: '5px' }}>*</span>
                </label>
                <textarea
                  {...register('description')}
                  className="support-area"
                  name="description"
                />

                <div className="modal-footer">
                  <div className="support-btn-block">
                    <button className="support-btn">Send</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
