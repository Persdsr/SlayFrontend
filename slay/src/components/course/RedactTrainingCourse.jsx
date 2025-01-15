import React, {useEffect, useState} from "react";
import {useForm, useFieldArray, FormProvider} from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import {useAuthStore} from "../store/store";
import TrainingCourseService from "../../service/TrainingCourseService";
import {useParams} from "react-router-dom";
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
                  {/*  <h2 className="main-center-title">Video</h2>*/}
                    <div className="input-simple-wrapper">
                        <label className="file-input-label">
                            <input
                                type="file"
                                accept="video/*"
                                className="file-input"
                                {...register(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`)}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    handleFileChange(e)
                                    if (file) {
                                        // Сохраняем файл для отправки на сервер
                                        setValue(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`, file);
                                        // Создаём URL для отображения
                                        const objectUrl = URL.createObjectURL(file);
                                        setValue(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`, objectUrl);

                                    }
                                }}
                            />
                            {watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`) ||
                            watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`) ? (
                                <VideoPlayer
                                    title="Video Preview"
                                    videoUrl={
                                        typeof watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`) === "string" && watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`)
                                            ? watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videos`).replace("download", "view")
                                            : watch(`${prefix}.trainingCourseStepDetails[${detailIndex}].videoPreview`)
                                    }
                                />
                            ) : (
                                <span className="placeholder">Choose a file or drag it here</span>
                            )}
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

const RedactTrainingCourse = () => {
    const useAuth = useAuthStore()
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const params = useParams()
    const [uploadedFiles, setUploadedFiles] = useState([]);

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

    const uploadFiles = async () => {
        const formData = new FormData();

        uploadedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            return await axios.post(
                "http://localhost:8080/api/files/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

        } catch (error) {
            return [];
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };


    const onSubmit = async (data) => {
        const formData = new FormData();
        const filesUrls = await uploadFiles();
        console.log("FILES URLS: ")
        console.log(filesUrls)
        console.log("UPLOADED FILES: ")
        console.log(uploadedFiles)

        formData.append("data", JSON.stringify({
            name: data.name,
            description: data.description,
            price: data.price,
            authorUsername: useAuth?.userData?.username,
            category: data.category,
            tags: data.tags,
            trainingCourseSteps: data.trainingCourseSteps.map((step, stepIndex) => ({
                title: step.title,
                description: step.description,
                trainingCourseStepDetails: step.trainingCourseStepDetails.map((detail, detailIndex) => ({
                    title: detail.title,
                    description: detail.description,
                    video:  detail?.videos?.name ? "http://localhost:8080/download/" + detail?.videos?.name : watch(`trainingCourseSteps[${stepIndex}].trainingCourseStepDetails[${detailIndex}].videos`)
                })),
            })),
        }));

        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        if (data.poster) formData.append("poster", data.poster);
        if (data.trailer) formData.append("trailer", data.trailer);



        try {
            const response = await fetch(`http://localhost:8080/api/training-course/update/${params.courseId}`, {
                method: 'PUT',
                body: formData,
            });
            const text = await response.text();

            if (response.ok) {
                console.log('Response:', text);
                alert('Course updated successfully!');
            } else {
                console.error('Server error:', text);
                alert(`Error: ${text}`);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

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
            const formattedTags = categoriesResponse.data.tags.map((tag) => ({
                value: tag, // Уникальное значение
                label: tag, // Отображаемое название
            }));
            setTags(formattedTags);


        };
        fetchData();
    }, [setValue, params.courseId]);

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

                            <input className="simple-input" {...register('name', {required: 'Name is required'})} />
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
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Сохраняем файл для отправки на сервер
                                                setValue(`poster`, file);
                                                // Создаём URL для отображения
                                                const objectUrl = URL.createObjectURL(file);
                                                setValue(`posterPreview`, objectUrl);
                                            }
                                        }}
                                    />
                                    {watch(`posterPreview`) ||
                                    watch(`poster`) ? (
                                        <img
                                            style={{width: '350px'}}
                                            src={
                                                typeof watch("poster") === "string" && watch("poster")
                                                    ? watch("poster")
                                                    : watch("posterPreview")
                                            }
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
                                        accept="video/*"
                                        className="file-input"
                                        {...register(`trailer`)}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Сохраняем файл для отправки на сервер
                                                setValue(`trailer`, file);
                                                // Создаём URL для отображения
                                                const objectUrl = URL.createObjectURL(file);
                                                setValue(`trailerPreview`, objectUrl);
                                            }
                                        }}
                                    />
                                    {watch(`trailerPreview`) ||
                                    watch(`trailer`) ? (
                                        <VideoPlayer
                                            title="Video Preview"
                                            videoUrl={
                                                typeof watch("trailer") === "string" && watch("trailer")
                                                    ? watch("trailer").replace("download", "view")
                                                    : watch("trailerPreview")
                                            }
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
                                setValue={setValue}
                                options={tags}
                                onChange={(selectedOptions) =>
                                    setValue('tags', selectedOptions.map(option => option.value))
                            }
                                value={watch('tags')?.map(tag => ({value: tag.name, label: tag.name})) || []}
                            />
                        </div>

                        <div className="form-course-create-container">
                            <CourseStepFormField
                                setValue={setValue}
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


export default RedactTrainingCourse;
