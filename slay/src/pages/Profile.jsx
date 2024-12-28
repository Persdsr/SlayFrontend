import React, { useEffect, useState } from "react";
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import TrainingCourseService from "../service/TrainingCourseService";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import ComplaintCourseService from "../service/ComplaintCourseService";
import {useAuthStore} from "../components/store/store";

const Profile = () => {
    const [data, setData] = useState([]);
    const [menuOpen, setMenuOpen] = useState("");
    const [editCourseId, setEditCourseId] = useState(null);
    const [editedDescription, setEditedDescription] = useState("");
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const [complaintTypesMap, setComplaintTypesMap] = useState([]);
    const [requestResultText, setRequestResultText] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const params = useParams()

    const toggleMenu = (name) => {
        setMenuOpen(menuOpen === name ? null : name);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await TrainingCourseService.getAuthorTrainingCourses(params.username);
                if (!response.data || !response.data.author) {
                    throw new Error("Пользователь не найден");
                }
                setData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/not-found");
            }
        };

        fetchUserData();
    }, [params.username, navigate]);

    const deleteCourse = async (courseId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
            try {
                await TrainingCourseService.deleteCourseById(courseId);
                window.location.reload();
            } catch (error) {
                console.log("Error delete course:", error);
            }
        }
    };

    const startEditing = (course) => {
        setEditCourseId(course.id);
        setEditedDescription(course.description);
    };

    const saveChanges = async (courseId) => {
        try {
            await TrainingCourseService.updateTrainingCourseBybFields(courseId, { description: editedDescription });
            const updatedCourses = data.map((course) =>
                course.id === courseId ? { ...course, description: editedDescription } : course
            );
            setData(updatedCourses);
            setEditCourseId(null);
        } catch (error) {
            console.log("Error updating course:", error);
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
            courseComplaintType: data.complaintRequestType.label,
            description: data.description,
        };

        try {
            const response = await ComplaintCourseService.createComplaintCourse(complaintBody);
            setRequestResultText("Жалоба успешно отправлена, можете закрыть окно");
            reset();
        } catch (error) {
            console.error("Ошибка отправки жалобы:", error);
        }
    };

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage("");
    };

    return (
        <div className="profile-container">
            <div className="profile-setting-links">
                <NavLink to={`/profile/${authStore?.userData?.username}`} className="admin-menu-link">
                    <span role="img" aria-label="zxc">📞</span> Профиль
                </NavLink>
                <NavLink to="/settings" className="admin-menu-link">
                    <span role="img" aria-label="setting">📝</span> Жалобы
                </NavLink>
                <NavLink to="/about" className="admin-menu-link">
                    <span role="img" aria-label="password">🚫</span> Забаненные пользователи
                </NavLink>
            </div>

            <div className="profile-block">
                <div className="banner-container">
                    <img
                        className="profile-banner"
                        src="/Dizayn-bez-nazvaniya-_13_.png"
                        alt="Profile Banner"
                    />
                    <button className="profile-follow">Follow</button>
                </div>
                <div className="avatar-container">
                    <img className="profile-avatar" src={data?.author?.avatar} alt="User Avatar" />
                    <div className="profile-user-info">
                        <span>{data?.author?.username}</span>
                        <span className="profile-user-name">@{data?.author?.username}</span>
                    </div>
                    <span className="profile-user-description">
                        {data?.author?.aboutMe}
                    </span>
                </div>

                <div className="profile-user-content">
                    <div className="profile-user-training-courses">
                        {data?.courses?.map((course) => (
                            <div className="user-training-course-block" key={course.id}>
                                <div className="user-training-course-info">
                                    <img src={data?.author?.avatar} alt="" />
                                    <div>
                                        <span className="course-author-name">{course.author}</span>
                                        <span className="course-author-user-name">@{course.author}</span>
                                    </div>
                                    <span className="user-training-course-createAt">
                                        {format(new Date(course.createAt), "dd.MM.yyyy")}
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
                                                <li onClick={() => deleteCourse(course.id)}>Удалить</li>
                                                <li onClick={() => startEditing(course)}>Изменить</li>
                                                <li onClick={() => openComplaintModal(course.id)}>Пожаловаться</li>
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
                                        <button onClick={() => saveChanges(course.id)}>Сохранить</button>
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
                                        <Link to={`/course/detail/${course.id}`}>
                                            <button className="purchase-button">Перейти к описанию</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="profile-reviews-container">
                {data[0]?.reviews?.slice(0, 5).map((review, index) => (
                    <div key={index} className="profile-review-block">
                        <div className="review-author-info">
                            <img src={review.author.avatar} alt="Author Avatar" />
                            <span>{review.author.username}</span>
                        </div>
                        <div className="review-content">
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
                    <img src={selectedImage} alt="Selected Review"/>
                    </div>
                </div>
            )}

            {showComplaintModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Подать жалобу</h2>
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

                                <div className="input-support-wrapper">
                                    <label htmlFor="requestType" className="support-label">
                                        Тип поддержки<span style={{color: "red"}}>*</span>
                                    </label>
                                    <select
                                        name="requestType"
                                        className="support-input"
                                        {...register("complaintRequestType")}
                                    >
                                        <option value="" disabled selected>
                                            Выберите тип поддержки
                                        </option>
                                        {Object.entries(complaintTypesMap).map(([value, label]) => (
                                            <option value={label}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <label htmlFor="description" className="support-label">
                                    Описание<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="support-area"
                                    name="description"
                                />


                                <div className="modal-footer">
                                    <div className="support-btn-block">
                                        <button className="support-btn">Отправить</button>
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
