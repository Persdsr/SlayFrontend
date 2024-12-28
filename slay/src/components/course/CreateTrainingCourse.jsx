import React, {useEffect, useState} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {useAuthStore} from "../store/store";
import TrainingCourseService from "../../service/TrainingCourseService";

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
                            image: null,
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

        // Формируем данные формы
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
                if (detail.image) formData.append(`images`, detail.image[0]);
                if (detail.video) formData.append(`videos`, detail.video[0]);
            });
        });

        try {
            const response = await fetch('http://localhost:8080/api/training-course/create', {
                method: 'POST',
                body: formData,
            });

            // Читаем как текст, чтобы увидеть полный ответ сервера
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
        <div className="support-container">
            <h2>Create Training Course</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="input-support-wrapper">
                    <label className="support-label">
                        Название курса<span style={{color: "red", marginBottom: "5px"}}>*</span>
                    </label>
                    <input className="support-input" {...register('name', {required: 'Name is required'})} />
                </div>

                <label className="support-label">
                    Описание<span style={{color: "red", marginBottom: "5px"}}>*</span>
                </label>
                <textarea
                    {...register('description', {required: 'Description is required'})}
                    className="support-area"
                    name="description"
                />

                <div>
                    <label>Poster</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('poster')}
                    />
                </div>

                <div>
                    <label>Trailer</label>
                    <input
                        type="file"
                        accept="video/*"
                        {...register('trailer')}
                    />
                </div>

                <div className="input-support-wrapper">
                    <label className="support-label">
                        Цена<span style={{color: "red", marginBottom: "5px"}}>*</span>
                    </label>
                    <input type="number" className="support-input" {...register('price', {required: 'Price is required'})} />
                </div>

                <div>
                    <label>Категории</label>
                    <select {...register('category')}>
                        {
                            categories.map((category) => (
                                <option value={category} key={category}>{category}</option>
                            ))
                        }
                    </select>
                </div>

                <div>
                    <label>Tags</label>
                    <select {...register('tags')} multiple>
                        <option value="tag1">Tag 1</option>
                        <option value="tag2">Tag 2</option>
                    </select>
                </div>

                <div>
                    <h3>Шаги курса</h3>
                    {stepFields.map((step, index) => (
                        <div key={step.id}>


                            <div key={step.id} className="input-support-wrapper">
                                <label className="support-label">
                                    Название шага<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                </label>
                                <input
                                    className="support-input" {...register(`trainingCourseSteps[${index}].title`)} />
                            </div>

                            <label className="support-label">
                                Описание шага<span style={{color: "red", marginBottom: "5px"}}>*</span>
                            </label>
                            <textarea
                                {...register(`trainingCourseSteps[${index}].description`, {required: 'Description is required'})}
                                className="support-area"
                            />

                            <h4>Детали шага</h4>
                            {detailFields.map((detail, detailIndex) => (
                                <div key={detail.id}>
                                    <div className="input-support-wrapper">
                                        <label className="support-label">
                                            Заголовок детали<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                        </label>
                                        <input
                                            className="support-input" {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].title`)} />
                                    </div>

                                    <div className="input-support-wrapper">
                                        <label className="support-label">
                                            Описание детали<span style={{color: "red", marginBottom: "5px"}}>*</span>
                                        </label>
                                        <input
                                            className="support-input" {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].description`)} />
                                    </div>

                                    <div>
                                        <label>Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].image`)}
                                        />
                                    </div>

                                    <div>
                                        <label>Video</label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            {...register(`trainingCourseSteps[${index}].trainingCourseStepDetails[${detailIndex}].video`)}
                                        />
                                    </div>

                                    <button type="button" onClick={() => removeDetail(detailIndex)}>
                                        Remove Detail
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={() => appendDetail({
                                title: '',
                                description: '',
                                image: null,
                                video: null
                            })}>
                                Add Step Detail
                            </button>

                            <button type="button" onClick={() => removeStep(index)}>
                                Remove Step
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={() => appendStep({
                        title: '',
                        description: '',
                        trainingCourseStepDetails: [{title: '', description: '', image: null, video: null}],
                    })}>
                        Add Step
                    </button>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateTrainingCourse;
