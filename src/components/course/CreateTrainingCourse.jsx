import React, {useEffect, useState} from "react";
import {useForm, useFieldArray, FormProvider} from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import {useAuthStore} from "../store/store";
import TrainingCourseService from "../../service/TrainingCourseService";
import VideoPlayer from "../VideoPlayer";
import axios from "axios";

const CourseStepDetailFormField = ({prefix, register, control, watch, setValue, uploadedFiles, setUploadedFiles, handleFileChange}) => {
    const {fields, append, remove} = useFieldArray({
        control,
        name: `${prefix}.trainingCourseStepDetails`,
    });

    return (
        <div>
            <div className="step-title-name center-title">
                <span className="label-input-name">{`Step `}</span>
                <span className="label-input-name" style={{color: "#919191", marginLeft: "5px"}}>
                            {watch?.(`${prefix}.title`) + " "}
                        </span>
                <span className="label-input-name" style={{marginLeft: "5px"}}>{` details`}</span>
            </div>
            {fields.map((detail, detailIndex) => (
                <div key={detail.id} className="form-course-step-detail-block">
                    <button
                        type="button"
                        onClick={() => remove(detailIndex)}
                        className="remove-course-files-button"
                    >
                        ×
                    </button>
                    <div className="input-simple-wrapper">
                        <label>
                            <span className="label-input-name">Title</span>
                            <input
                                className="simple-input"
                                {...register(
                                    `${prefix}.trainingCourseStepDetails[${detailIndex}].title`
                                )}
                            />
                        </label>
                    </div>
                    <div className="input-simple-wrapper">
                        <label className="support-label">
                            <span className="label-input-name">Description</span>
                            <textarea
                                className="support-area"
                                {...register(
                                    `${prefix}.trainingCourseStepDetails[${detailIndex}].description`
                                )}
                            />
                        </label>
                    </div>
                    <h2 className="main-center-title">Video</h2>
                    <div className="input-simple-wrapper">
                        <label className="file-input-label">
                            <input
                                type="file"
                                {...register(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`)}
                                className="file-input"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    const file = e.target.files[0];
                                    if (file) {
                                        setValue(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`, file);
                                    }
                                }}
                            />
                            {(() => {
                                const file = watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`);
                                return file instanceof File ? (
                                    <VideoPlayer videoUrl={URL.createObjectURL(file)} />
                                ) : (
                                    <span className="placeholder">Choose a file or drag it here</span>
                                );
                            })()}
                        </label>

                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={() =>
                    append({title: "", description: "", video: null})
                }
                className="btn-add-detail"
            >
                Add Step Detail
            </button>
        </div>
    );
};

const CourseStepFormField = ({control, register, watch, setValue, uploadedFiles, setUploadedFiles, handleFileChange}) => {
    const {fields, append, remove} = useFieldArray({
        control,
        name: "trainingCourseSteps",
    });

    return (
        <div className="form-course-create-container">
            <h3>Course Steps</h3>
            {fields.map((step, stepIndex) => (
                <div key={step.id} className="form-course-step-block">
                    <div className="step-title-name">
                        <span className="label-input-name">{`Step ${stepIndex + 1}:`}</span>
                        <span className="label-input-name" style={{color: "#919191", marginLeft: "5px"}}>
                            {watch?.(`trainingCourseSteps[${stepIndex}].title`)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => remove(stepIndex)}
                        className="remove-course-files-button"
                    >
                        ×
                    </button>
                    <div className="input-simple-wrapper">
                        <label>
                            <span className="label-input-name">Title</span>
                            <input
                                className="simple-input"
                                {...register(`trainingCourseSteps[${stepIndex}].title`)}
                            />
                        </label>
                    </div>
                    <div className="support-label">
                        <label>
                            <span className="label-input-name">Description</span>
                            <textarea
                                className="support-area"
                                {...register(`trainingCourseSteps[${stepIndex}].description`)}
                            />
                        </label>
                    </div>
                    <CourseStepDetailFormField
                        prefix={`trainingCourseSteps[${stepIndex}]`}
                        register={register}
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        handleFileChange={handleFileChange}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={() =>
                    append({
                        title: "",
                        description: "",
                        trainingCourseStepDetails: [{title: "", description: "", video: null}],
                    })
                }
                className="btn-add-step"
            >
                Add Step
            </button>
        </div>
    );
};

const CreateTrainingCourse = () => {
    const useAuth = useAuthStore()
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const categoriesResponse = await TrainingCourseService.getAllCategoriesWitTags()
            setCategories(categoriesResponse.data.categories || [])
            const formattedTags = categoriesResponse.data.tags.map((tag) => ({
                value: tag, // Уникальное значение
                label: tag, // Отображаемое название
            }));
            setTags(formattedTags);
        }

        fetchData()
    }, []);

    const methods = useForm({
        defaultValues: {
            trainingCourseSteps: [
                {
                    title: "",
                    description: "",
                    trainingCourseStepDetails: [{title: "", description: "", video: null}],
                },
            ],
        },
    });

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

    const {handleSubmit, control, register, watch, setValue} = methods;

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("data", JSON.stringify({
            name: data.name,
            description: data.description,
            price: data.price,
            authorUsername: useAuth?.userData?.username,
            category: data.category,
            tags: data.tags ? data.map((tag) => tag.value) : [],
            trainingCourseSteps: data.trainingCourseSteps.map((step) => ({
                title: step.title,
                description: step.description,
                trainingCourseStepDetails: step.trainingCourseStepDetails.map((detail) => ({
                    title: detail.title,
                    description: detail.description,
                    video: detail.videos.name
                })),
            })),
        }));

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file) => {
                formData.append("files", file);
            });
        }

        if (data.poster) formData.append("poster", data.poster[0]);
        if (data.trailer) formData.append("trailer", data.trailer[0]);

        data.trainingCourseSteps.forEach((step) => {
            step.trainingCourseStepDetails.forEach((detail) => {
                if (detail.video) formData.append(`videos`, detail.video[0]);
            });
        });

        console.log(data.files)

        try {
            const response = await axios.post(`${process.env.API_BASE_URL}/api/training-course`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                })
            if (response.status === 200) {
                console.log('Response:', response);
                alert('Course created successfully!');
            } else {
                console.error('Server error:', response);
                alert(`Error: }`);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    return (
        <div className="main-center-container">
            <h2>Create Training Course</h2>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-simple-wrapper">
                        <div className="input-simple-wrapper">
                            <label className="support-label">
                                Название курса<span style={{color: "red", marginBottom: "5px"}}>*</span>
                            </label>

                            <input className="simple-input" {...register('name', {required: 'Name is required', minLength:3, maxLength: 100})} />
                        </div>

                        <div className="input-simple-wrapper">
                            <label className="support-label">
                                Описание<span style={{color: "red", marginBottom: "5px"}}>*</span>
                            </label>
                            <textarea
                                {...register('description', {required: 'Description is required'})}
                                className="support-area"
                                name="description"
                            />
                        </div>

                        <div className="input-simple-wrapper">
                            <label className="support-label">
                                Цена<span style={{color: "red", marginBottom: "5px"}}>*</span>
                            </label>
                            <input type="number"
                                   className="simple-input" {...register('price', {required: 'Price is required'})} />
                        </div>

                        <div className="media-input-block">
                            <h2 className="main-center-title">Poster</h2>
                            <div className="file-input-wrapper">
                                <label className="file-input-label">
                                    <input
                                        type="file"
                                        {...register('poster')}
                                        className="file-input"
                                    />
                                    {watch("poster")?.[0] ? (
                                        <img
                                            src={URL.createObjectURL(watch("poster")[0])}
                                            alt="Uploaded Poster"
                                            style={{width: '350px'}}

                                        />
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
                                    {watch("trailer")?.[0] ? (
                                        <VideoPlayer
                                            videoUrl={URL.createObjectURL(watch("trailer")[0])}

                                        />
                                    ) : (
                                        <span className="placeholder">Choose a file or drag it here</span>
                                    )}
                                </label>
                            </div>

                        </div>


                        <div className="category-selection">
                            <label className="category-label">Categories</label>
                            <div className="category-container">
                                {categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className={`category-block ${
                                            watch("category") === category?.name ? "selected" : ""
                                        }`}
                                        onClick={() => setValue("category", category?.name)}
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

                        <div className="tags-select-block">
                            <label className="category-label">Tags</label>
                            <CreatableSelect
                                styles={customStyles}
                                isMulti
                                options={tags}
                                onChange={(selectedOptions) => {
                                    setValue('tags', selectedOptions)
                                }
                            }

                            />
                        </div>

                        <div className="form-course-create-container">
                            <CourseStepFormField setValue={setValue}
                                                 watch={watch}
                                                 control={control}
                                                 register={register}
                                                 handleFileChange={handleFileChange}
                                                 uploadedFiles={uploadedFiles}
                                                 setUploadedFiles={setUploadedFiles}
                            />

                        </div>

                        <button className="support-btn" type="submit">Submit</button>

                    </div>
                </form>
            </FormProvider>
        </div>
    );
};


export default CreateTrainingCourse;
