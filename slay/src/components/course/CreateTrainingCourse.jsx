import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {useAuthStore} from "../store/store";
import TrainingCourseService from "../../service/TrainingCourseService";
import CreatableSelect from 'react-select/creatable';

const CreateTrainingCourse = () => {
    const useAuth = useAuthStore()
    const [categories, setCategories] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            const categoriesResponse = await TrainingCourseService.getAllCategoriesNames()
            setCategories(categoriesResponse.data)
        }

        fetchData()
    }, []);

    const { control, handleSubmit, register, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            description: '',
            poster: null,
            trailer: null,
            price: '',
            authorUsername: '',
            category: '',
            tags: [],
            trainingCourseSteps: [
                {
                    title: '',
                    description: '',
                    trainingCourseStepDetails: [
                        {
                            title: '',
                            description: '',
                            video: null,
                        },
                    ],
                },
            ],
        },
    });

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: 'trainingCourseSteps',
    });

    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
        control,
        name: 'trainingCourseSteps[0].trainingCourseStepDetails',
    });

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("data", JSON.stringify({
            name: data.name,
            description: data.description,
            price: data.price,
            authorUsername: useAuth?.userData?.username,
            category: data.category,
            tags: data.tags,
            trainingCourseSteps: data.trainingCourseSteps.map((step) => ({
                title: step.title,
                description: step.description,
                trainingCourseStepDetails: step.trainingCourseStepDetails.map((detail) => ({
                    title: detail.title,
                    description: detail.description,
                })),
            })),
        }));

        if (data.poster) formData.append("poster", data.poster[0]);
        if (data.trailer) formData.append("trailer", data.trailer[0]);

        data.trainingCourseSteps.forEach((step) => {
            step.trainingCourseStepDetails.forEach((detail) => {
                if (detail.video) formData.append(`videos`, detail.video[0]);
            });
        });

        try {
            const response = await fetch('http://localhost:8080/api/training-course/create', {
                method: 'POST',
                body: formData,
            });
            console.log(data)
            const text = await response.text();

            if (response.ok) {
                console.log('Response:', text);
                alert('Course created successfully!');
            } else {
                console.error('Server error:', text);
                alert(`Error: ${text}`);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const customStyles = {
        container: (provided, state) => ({
            ...provided,
            width: "100%", // Ширина контейнера
            maxWidth: "400px", // Максимальная ширина
            borderColor: state.isHover ? "#23c483" : "#fff", // Цвет фона при наведении
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#f9f9f9", // Фон
            borderColor: state.isFocused ? "#23c483" : "#ddd", // Цвет границы при фокусе
            boxShadow: state.isFocused ? "0 0 4px rgba(0, 123, 255, 0.5)" : "none",
            borderRadius: "8px", // Скругленные углы
            padding: "2px", // Внутренние отступы
            transition: "all 0.2s ease-in-out",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#999", // Цвет текста placeholder
            fontSize: "14px",
        }),
        input: (provided) => ({
            ...provided,
            color: "#333", // Цвет текста
            fontSize: "14px",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#fff", // Фон меню
            borderRadius: "8px", // Скругленные углы
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Тень
            marginTop: "4px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#23c483" : "#fff", // Цвет фона при наведении
            color: state.isFocused ? "#fff" : "#333", // Цвет текста при наведении
            padding: "10px", // Отступы внутри опции
            cursor: "pointer",
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#e0ffe5", // Фон тега
            borderRadius: "4px",
            padding: "2px 4px",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "#23c483", // Цвет текста тега
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#23c483", // Цвет крестика
            cursor: "pointer",
            ":hover": {
                backgroundColor: "#23c483", // Фон при наведении на крестик
                color: "#fff", // Цвет текста при наведении
            },
        }),
    };


    return (
        <div className="main-center-container">
            <h2>Create Training Course</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="input-simple-wrapper">
                    <label className="support-label">
                        Название курса<span style={{color: "red", marginBottom: "5px"}}>*</span>
                    </label>
                    <input className="simple-input" {...register('name', {required: 'Name is required'})} />
                </div>

                <label className="support-label">
                    Описание<span style={{color: "red", marginBottom: "5px"}}>*</span>
                </label>
                <textarea
                    {...register('description', {required: 'Description is required'})}
                    className="support-area"
                    name="description"
                />

                <h2 className="main-center-title">Poster</h2>
                <div className="file-input-wrapper">
                    <label className="file-input-label">
                        <input
                            type="file"
                            {...register('poster')}
                            className="file-input"
                        />
                        {watch("poster") ? (
                            <span className="file-name">{watch("poster")[0].name}</span>
                        ) : (
                            <span className="placeholder">Choose a file or drag it here</span>
                        )}
                    </label>
                </div>


                <h2 className="main-center-title">Trailer</h2>
                <div className="file-input-wrapper">
                    <label className="file-input-label">
                        <input
                            type="file"
                            {...register('trailer')}
                            className="file-input"
                        />
                        {watch("trailer") ? (
                            <span className="file-name">{watch("trailer")[0].name}</span>
                        ) : (
                            <span className="placeholder">Choose a file or drag it here</span>
                        )}
                    </label>
                </div>


                <div className="input-simple-wrapper">
                    <label className="support-label">
                        Цена<span style={{color: "red", marginBottom: "5px"}}>*</span>
                    </label>
                    <input type="number"
                           className="simple-input" {...register('price', {required: 'Price is required'})} />
                </div>

                <div className="category-selection">
                    <label className="category-label">Категории</label>
                    <div className="category-container">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className={`category-block ${
                                    watch("category") === category.name ? "selected" : ""
                                }`}
                                onClick={() => setValue("category", category.name)}
                            >
                                <img
                                    src={category.poster}
                                    alt={category.name}
                                    className="category-image"
                                />
                                <p className="category-select-name">{category.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Tags</label>
                    <CreatableSelect styles={customStyles}  isMulti  />;
                </div>

                <div className="form-course-create-container">
                    <h3>Шаги курса</h3>
                    {stepFields.map((step, index) => (
                        <div key={step.id} className="form-course-step-block">
                            {/* Крестик для удаления шага */}
                            <button
                                type="button"
                                className="remove-course-files-button"
                                onClick={() => removeStep(index)}
                            >
                                ×
                            </button>

                            <div className="input-simple-wrapper">
                                <label className="support-label">
                                    Название шага<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                </label>
                                <input
                                    className="simple-input"
                                    {...register(`trainingCourseSteps[${index}].title`)}
                                />
                            </div>

                            <label className="support-label">
                                Описание шага<span style={{color: "red", marginBottom: "5px"}}>*</span>
                            </label>
                            <textarea
                                {...register(`trainingCourseSteps[${index}].description`, {
                                    required: 'Description is required',
                                })}
                                className="support-area"
                            />

                            <h3>Детали шага</h3>
                            {detailFields.map((detail, detailIndex) => (
                                <div key={detail.id} className="form-course-step-detail-block">
                                    <button
                                        type="button"
                                        className="remove-course-files-button"
                                        onClick={() => removeDetail(detailIndex)}
                                    >
                                        ×
                                    </button>

                                    <div className="input-simple-wrapper">
                                        <label className="support-label">
                                            Заголовок детали<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                        </label>
                                        <input
                                            className="simple-input"
                                            {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].title`)}
                                        />
                                    </div>

                                    <div className="input-simple-wrapper">
                                        <label className="support-label">
                                            Описание детали<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                        </label>
                                        <input
                                            className="simple-input"
                                            {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].description`)}
                                        />
                                    </div>

                                    <h2 className="main-center-title">Video</h2>
                                    <div className="file-input-wrapper">
                                        <label className="file-input-label">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].video`)}
                                                className="file-input"
                                            />
                                            {watch(
                                                `trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].video`
                                            ) ? (
                                                <span className="file-name">
                                {watch(
                                    `trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].video`
                                )[0].name}
                            </span>
                                            ) : (
                                                <span className="placeholder">
                                Choose a file or drag it here
                            </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <button className="btn-add-detail"
                                type="button"
                                onClick={() =>
                                    appendDetail({
                                        title: '',
                                        description: '',
                                        video: null,
                                    })
                                }
                            >
                                Add Step Detail
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn-add-step"
                        onClick={() =>
                            appendStep({
                                title: '',
                                description: '',
                                trainingCourseStepDetails: [
                                    { title: '', description: '', video: null },
                                ],
                            })
                        }
                    >
                        Add Step
                    </button>
                </div>

                <button className="support-btn" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateTrainingCourse;
