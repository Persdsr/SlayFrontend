import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import TrainingCourseService from "../../service/TrainingCourseService";
import AdminPanelLinks from "../navbar/AdminPanelLinks";
import {useForm} from "react-hook-form";
import Modal from "../modal/Modal";
import SportCategoryRedactModalContent from "../modal/SportCategoryRedactModalContent";
import CreateSportCategoryModal from "../modal/CreateSportCategoryModal";

const AdminSportCategory = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate()
    const {register, handleSubmit, reset, watch, setValue, formState: {
        errors
    }} = useForm()
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

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
        const fetchSupports = async () => {
            try {
                const response = await TrainingCourseService.getSportCategoriesName();
                setData(response.data)
            } catch (e) {
                navigate('/*');
            }
        };

        fetchSupports();
    }, []);
    return (
        <div className="content-container">
            <AdminPanelLinks/>

            <div className="content-block">
                <h2 className="admin-page-title">Sport categories
                    <span onClick={() => openModal("CREATE SPORT CATEGORY",
                        <CreateSportCategoryModal

                    />)}
                          style={{color: "#23c483", fontSize: "12px", cursor: 'pointer'}}> create</span></h2>
                <div className="main-content">
                    <div className="category-container">
                        {data.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => openModal(`REDACT CATEGORY - ${category.name}`, <SportCategoryRedactModalContent
                                    category={category}
                                    errors={errors}
                                    register={register}
                                    watch={watch}
                                    setValue={setValue}
                                    handleSubmit={handleSubmit}
                                    reset={reset}
                                />)}
                                className={`category-block`}
                            >
                                <img
                                    src={category?.poster}
                                    alt={category?.name}
                                    className="category-image"
                                />
                                <p className="category-select-name">{category?.name}</p>
                            </div>
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
        </div>
    );
};

export default AdminSportCategory;