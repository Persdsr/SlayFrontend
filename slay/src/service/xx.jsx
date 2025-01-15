import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {useAuthStore} from "../store/store";
import TrainingCourseService from "../../service/TrainingCourseService";
import CreatableSelect from 'react-select/creatable';
import {useParams} from "react-router-dom";
import VideoPlayer from "../VideoPlayer";

const RedactTrainingCourse = () => {
    const useAuth = useAuthStore()
    const [categories, setCategories] = useState([])
    const [courseDetail, setCourseDetail] = useState()
    const [tags, setTags] = useState([])
    const params = useParams()


    useEffect(() => {
        const fetchData = async () => {
            const courseResponse = await TrainingCourseService.getTrainingCourseById(params.courseId)
            const categoriesResponse = await TrainingCourseService.getAllCategoriesWitTags()
            setCourseDetail(courseResponse?.data.body)
            setCategories(categoriesResponse?.data.categories)
            setValue("category", courseResponse?.data.body.category)
            console.log(courseResponse?.data.body)
            const formattedTags = categoriesResponse.data.tags.map((tag) => ({
                value: tag,
                label: tag,
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

    useEffect(() => {
        const fetchData = async () => {
            const courseResponse = await TrainingCourseService.getTrainingCourseById(params.courseId);
            const categoriesResponse = await TrainingCourseService.getAllCategoriesWitTags();
            const courseDetail = courseResponse?.data.body;

            setValue("name", courseDetail?.name || "");
            setValue("description", courseDetail?.description || "");
            setValue("price", courseDetail?.price || "");
            setValue("category", courseDetail?.category || "");
            setValue("tags", courseDetail?.tags || []);
            setValue("poster", courseDetail?.poster || null);
            setValue("trailer", courseDetail?.trailer || null);

            if (courseDetail?.trainingCourseSteps?.length) {
                const steps = courseDetail.trainingCourseSteps.map((step) => ({
                    title: step.title || '',
                    description: step.description || '',
                    trainingCourseStepDetails: step.trainingCourseStepDetails?.length
                        ? step.trainingCourseStepDetails.map((detail) => ({
                            title: detail.title || '',
                            description: detail.description || '',
                            videos: detail.videos,
                        }))
                        : [{ title: '', description: '', videos: null }],
                }));
                setValue("trainingCourseSteps", steps);
            } else {
                setValue("trainingCourseSteps", [
                    {
                        title: '',
                        description: '',
                        trainingCourseStepDetails: [{ title: '', description: '', videos: null }],
                    },
                ]);
            }

            setCategories(categoriesResponse?.data.categories || []);
            setTags(
                categoriesResponse?.data.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                })) || []
            );

        };
        fetchData();
    }, [setValue, params.courseId]);

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
        <label className="file-input-label">
            <input
                type="file"
                accept="video/*"
                className="file-input"
                {...register(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`)}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        setValue(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`, file); // Устанавливаем файл
                        const objectUrl = URL.createObjectURL(file);
                        setValue(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`, objectUrl);
                    }
                }}
            />
            {watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`) ||
            watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`) ? (
                <VideoPlayer
                    title="Video Preview"
                    videoUrl={
                        typeof watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`) === "string" && watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`)
                            ? watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].video`).replace("download", "view")
                            : watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`)
                    }
                />
            ) : (
                <span className="placeholder">Choose a file or drag it here</span>
            )}
        </label>
    );
};

export default RedactTrainingCourse;
