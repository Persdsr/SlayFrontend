import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { useAuthStore } from '../store/store';
import TrainingCourseService from '../../service/TrainingCourseService';
import VideoPlayer from '../player/VideoPlayer';
import axios from 'axios';
import LoadingPageIndicator from "../LoadingPageIndicator";
import LoadingMiniIndicator from "../LoadingMiniIndicator";

const CourseStepDetailFormField = ({
  prefix,
  register,
  control,
  watch,
    stepIndex,
  setValue,
  uploadedFiles,
  setUploadedFiles,
  handleFileChange,
    errors
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${prefix}.trainingCourseStepDetails`,
  });

  return (
    <div>
      <div className="step-title-name center-title">
        <span className="label-input-name">{`Step `}</span>
        <span
          className="label-input-name"
          style={{ color: '#919191', marginLeft: '5px' }}
        >
          {watch?.(`${prefix}.title`) + ' '}
        </span>
        <span
          className="label-input-name"
          style={{ marginLeft: '5px' }}
        >{` details`}</span>
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
                  `${prefix}.trainingCourseStepDetails[${detailIndex}].title`,
                    {
                      maxLength: {
                        value: 700,
                        message: 'Title must be no more than 700 characters',
                      },
                    }
                )}
              />
            </label>
          </div>
          {errors?.trainingCourseSteps?.[stepIndex]?.trainingCourseStepDetails?.[detailIndex]?.title?.message && (
              <span className="error-message">*{errors.trainingCourseSteps[stepIndex].trainingCourseStepDetails[detailIndex].title.message}</span>
          )}
          <div className="input-simple-wrapper">
            <label className="support-label">
              <span className="label-input-name">Description</span>
              <textarea
                className="support-area"
                {...register(
                  `${prefix}.trainingCourseStepDetails[${detailIndex}].description`,
                    {
                      maxLength: {
                        value: 1000,
                        message: 'Description must be no more than 1000 characters',
                      },
                    }
                )}
              />
            </label>
          </div>
          {errors.trainingCourseSteps?.[stepIndex].trainingCourseStepDetails?.[detailIndex].description?.message && (
              <span className="error-message">*{errors.trainingCourseSteps[stepIndex].trainingCourseStepDetails[detailIndex].description.message}</span>
          )}
          <h2 className="main-center-title">Video</h2>
          <div className="input-simple-wrapper">
            <label className="file-input-label">
              <input
                  type="file"
                  {...register(
                      `${prefix}.trainingCourseStepDetails[${detailIndex}].videos`,
                      {
                        validate: {
                          validFormat: (files) => {
                            if (!files || files.length === 0) return true;
                            const file = files[0];
                            if (!file) return 'No video file selected';
                            const acceptedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
                            return acceptedFormats.includes(file.type) || 'Unsupported video format';
                          },
                        },
                      }
                  )}
                  className="file-input"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) {
                      return;
                    }
                    const file = files[0];
                    if (file) {
                      handleFileChange(e);
                      setValue(
                          `${prefix}.trainingCourseStepDetails[${detailIndex}].videos`,
                          file
                      );
                    }
                  }}
              />
              {(() => {
                const file = watch(
                    `${prefix}.trainingCourseStepDetails[${detailIndex}].videos`
                );
                if (!file) return <span className="placeholder">Choose a file or drag it here</span>;
                return file instanceof File ? (
                    <VideoPlayer videoUrl={URL.createObjectURL(file)}/>
                ) : (
                    <span className="placeholder">Choose a file or drag it here</span>
                );
              })()}
            </label>
          </div>
          {errors.trainingCourseSteps?.[stepIndex].trainingCourseStepDetails?.[detailIndex].videos?.message && (
              <span
                  className="error-message">*{errors?.trainingCourseSteps[stepIndex].trainingCourseStepDetails[detailIndex].videos.message}</span>
          )}
        </div>
      ))}
      <button
          type="button"
          onClick={() => append({title: '', description: '', video: null})}
          className="btn-add-detail"
      >
        Add Step Detail
      </button>
    </div>
  );
};

const CourseStepFormField = ({
                               control,
                               register,
                               watch,
                               setValue,
                               uploadedFiles,
                               setUploadedFiles,
                               handleFileChange,
                               errors,
                             }) => {
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'trainingCourseSteps',
  });

  return (
      <div className="form-course-create-container">
        <h3>Course Steps</h3>
        {fields.map((step, stepIndex) => (
            <div key={step.id} className="form-course-step-block">
              <div className="step-title-name">
                <span className="label-input-name">{`Step ${stepIndex + 1}:`}</span>
                <span
                    className="label-input-name"
                    style={{color: '#919191', marginLeft: '5px'}}
                >
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
                      {...register(`trainingCourseSteps[${stepIndex}].title`, {
                        maxLength: {
                          value: 1000,
                          message: 'Title must be no more than 1000 characters',
                        },
                      })}
                  />
                </label>
              </div>
              {errors?.trainingCourseSteps?.[stepIndex]?.title?.message && (
                  <span className="error-message">
              *{errors.trainingCourseSteps[stepIndex].title.message}
            </span>
              )}
              <div className="support-label">
                <label>
                  <span className="label-input-name">Description</span>
                  <textarea
                      className="support-area"
                      {...register(`trainingCourseSteps[${stepIndex}].description`, {
                        maxLength: {
                          value: 1000,
                          message: 'Description must be no more than 1000 characters',
                        },
                      })}
                  />
                </label>
              </div>
              {errors?.trainingCourseSteps?.[stepIndex]?.description?.message && (
                  <span className="error-message">
              *{errors.trainingCourseSteps[stepIndex].description.message}
            </span>
              )}
              <CourseStepDetailFormField
                  prefix={`trainingCourseSteps[${stepIndex}]`}
                  stepIndex={stepIndex}
                  register={register}
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  handleFileChange={handleFileChange}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  errors={errors}
              />
            </div>
        ))}
        <button
            type="button"
            onClick={() =>
                append({
                  title: '',
                  description: '',
                  trainingCourseStepDetails: [
                    { title: '', description: '', video: null },
                  ],
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
  const useAuth = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesResponse =
        await TrainingCourseService.getAllCategoriesWitTags();
      setCategories(categoriesResponse.data.categories || []);
      const formattedTags = categoriesResponse.data.tags.map((tag) => ({
        value: tag,
        label: tag,
      }));
      setTags(formattedTags);
    };

    fetchData();
  }, []);

  const methods = useForm({
    defaultValues: {
      trainingCourseSteps: [
        {
          title: '',
          description: '',
          trainingCourseStepDetails: [
            { title: '', description: '', video: null },
          ],
        },
      ],
    },
  });

  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      width: '100%',
      maxWidth: '400px',
      borderColor: state.isHover ? '#23c483' : '#fff',
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f9f9f9',
      borderColor: state.isFocused ? '#23c483' : '#ddd',
      boxShadow: state.isFocused ? '0 0 4px rgba(0, 123, 255, 0.5)' : 'none',
      borderRadius: '8px',
      padding: '2px',
      transition: 'all 0.2s ease-in-out',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
      fontSize: '14px',
    }),
    input: (provided) => ({
      ...provided,
      color: '#333',
      fontSize: '14px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '4px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#23c483' : '#fff',
      color: state.isFocused ? '#fff' : '#333',
      padding: '10px',
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0ffe5',
      borderRadius: '4px',
      padding: '2px 4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#23c483',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#23c483',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#23c483',
        color: '#fff',
      },
    }),
  };

  const { handleSubmit, control, register, watch, setValue, formState: {
    errors: errors
  } } = methods;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append(
          "data",
          JSON.stringify({
            name: data.name,
            description: data.description,
            price: data.price,
            authorUsername: useAuth?.userData?.username,
            category: data.category,
            tags: data?.tags?.length > 0 ? data.tags.map((tag) => tag.value) : [],
            trainingCourseSteps: data.trainingCourseSteps.map((step) => ({
              title: step.title,
              description: step.description,
              trainingCourseStepDetails: step.trainingCourseStepDetails.map(
                  (detail) => ({
                    title: detail.title,
                    description: detail.description,
                    video: detail.videos.name,
                  })
              ),
            })),
          })
      );

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


      const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/training-course`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
      );

      if (response.status === 200) {
        console.log("Response:", response);
        alert("Course created successfully!");
      } else {
        console.error("Server error:", response);
        alert("Error: Server returned an unexpected response");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error: Failed to create the course");
    } finally {
      setIsLoading(false);
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
                Course name
                <span style={{color: 'red', marginBottom: '5px'}}>*</span>
              </label>

              <input
                  className="simple-input"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Name must be no more than 100 characters',
                    },
                  })}
              />
            </div>
            {errors.name?.message && (
                <span className="error-message">*{errors?.name.message}</span>
            )}

            <div className="input-simple-wrapper">
              <label className="support-label">
                Description
              </label>
              <textarea
                {...register('description', {
                  maxLength: {
                    value: 1000,
                    message: 'Description must be no more than 1000 characters',
                  },
                })}
                className="support-area"
                name="description"
              />
            </div>
            {errors.description?.message && (
                <span className="error-message">*{errors?.description.message}</span>
            )}

            <div className="input-simple-wrapper">
              <label className="support-label">
                Price
              </label>
              <label className="support-label">
              </label>
              <input
                  type="number"
                  className="simple-input"
                  {...register('price', {
                    min: {
                      value: 0,
                      message: 'Price must be greater than or equal to 0 (free course)',
                    },
                    max: {
                      value: 1000000,
                      message: 'Price must be no more than 1000000',
                    },
                  })}
              />
            </div>
            {errors.price?.message && (
                <span className="error-message">*{errors?.price.message}</span>
            )}

            <div className="media-input-block">
              <h2 className="main-center-title">Poster</h2>
              <span style={{color: 'red', marginBottom: '5px'}}>*</span>
              <div className="file-input-wrapper">
                <label className="file-input-label">
                  <input
                      type="file"
                      {...register('poster',
                          {
                            required: "Poster is required",
                            validate: {
                              validFormat: (files) => {
                                if (!files || files.length === 0) return true;
                                const file = files[0];
                                const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', "image/webp"];
                                return acceptedFormats.includes(file.type) || 'Unsupported image format';
                              },
                            },
                          })}
                      className="file-input"
                  />
                  {watch('poster')?.[0] ? (
                      <img
                          src={URL.createObjectURL(watch('poster')[0])}
                          alt="Uploaded Poster"
                          style={{width: '350px'}}
                      />
                  ) : (
                      <span className="placeholder">
                      Choose a file or drag it here
                    </span>
                  )}
                </label>
              </div>

              {errors.poster?.message && (
                  <span className="error-message">*{errors?.poster.message}</span>
              )}

              <h2 className="main-center-title">Trailer</h2>
              <div className="file-input-wrapper">
                <label className="file-input-label">
                  <input
                      type="file"
                      {...register('trailer', {
                        validate: {
                          validFormat: (files) => {
                            if (!files || files.length === 0) return true;
                            const file = files[0];
                            const acceptedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
                            return acceptedFormats.includes(file.type) || 'Unsupported video format';
                          },
                        },
                      })}
                      className="file-input"
                  />
                  {watch('trailer')?.[0] ? (
                      <VideoPlayer
                          videoUrl={URL.createObjectURL(watch('trailer')[0])}
                      />
                  ) : (
                      <span className="placeholder">
                      Choose a file or drag it here
                    </span>
                  )}
                </label>
              </div>
              {errors.trailer?.message && (
                  <span className="error-message">*{errors?.trailer.message}</span>
              )}
            </div>

            <div className="category-selection">
              <label className="category-label">Categories<span
                  style={{color: 'red', marginBottom: '5px'}}>*</span></label>

              <div className="category-container">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    {...register("category", {
                      required: "Pick one category"
                    })}
                    className={`category-block ${
                      watch('category') === category?.name ? 'selected' : ''
                    }`}
                    onClick={() => setValue('category', category?.name)}
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
            {errors.category?.message && (
                <span className="error-message">*{errors?.category.message}</span>
            )}

            <div className="tags-select-block">
              <label className="category-label">Tags</label>
              <CreatableSelect
                styles={customStyles}
                isMulti
                options={tags}
                onChange={(selectedOptions) => {
                  setValue('tags', selectedOptions);
                }}
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
                errors={errors}
              />
            </div>

              {isLoading ? (
                  <LoadingMiniIndicator />
              ) : (
                  <button className="green-center-btn" type="submit">
                      Submit
                  </button>
              )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateTrainingCourse;
