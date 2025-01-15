import {useAuthStore} from "../store/store";
import React, {useEffect, useState} from "react";
import TrainingCourseService from "../../service/TrainingCourseService";
import {useFieldArray, useForm} from "react-hook-form";
import CreatableSelect from "react-select/creatable";

const CreateTrainingCourse = () => {
    const useAuth = useAuthStore()
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            const categoriesResponse = await TrainingCourseService.getAllCategoriesWitTags()
            setCategories(categoriesResponse.data.categories)
            const formattedTags = categoriesResponse.data.tags.map((tag) => ({
                value: tag, // Уникальное значение
                label: tag, // Отображаемое название
            }));
            setTags(formattedTags);
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
        name: 'trainingCourseSteps[0].trainingCourseStepDetails', // ТУТ ДОБАВЛЯЕТСЯ ВСЕ К ИНДЕКСУ [0] ЭТО НЕ ПРАВИЛЬНО
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




    return (
        <div className="main-center-container">
            <h2>Create Training Course</h2>
            <form onSubmit={handleSubmit(onSubmit)}>




                <div className="category-selection">
                    <label className="category-label">Categories</label>
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
                    <label className="category-label">Tags</label>
                    <CreatableSelect
                        styles={customStyles}
                        isMulti
                        options={tags}
                        onChange={(selectedOptions) => setValue('tags', selectedOptions.map(option => option.value))}
                        value={watch('tags')?.map(tag => ({ value: tag, label: tag })) || []}
                    />
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