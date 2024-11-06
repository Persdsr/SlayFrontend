import React, {useEffect, useState} from 'react';
import TrainingCourseService from "../service/TrainingCourseService";
import axios from "axios";

const CreateTrainingCourse = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        trailer: null,
        poster: null
    });

    const handleCheckboxChange = (event) => {
        const {value, checked} = event.target;
        const updatedOptions = checked
            ? [...selectedOptions, value]
            : selectedOptions.filter((option) => option !== value);

        setSelectedOptions(updatedOptions);
        setFormData({
            ...formData,
            categories: updatedOptions,
        });
    };

    useEffect(() => {
        const fetchCategoryNames = async () => {
            const response = await TrainingCourseService.getSportCategoriesName()
            setCategoryOptions(response.data)
        }

        fetchCategoryNames()
    }, [])

    const handleInputChange = (e) => {
        const {name, value, type} = e.target;
        if (type === 'file') {
            if (name === "Screenshots") {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: [...prevFormData[name], ...e.target.files],
                }));
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: e.target.files[0],
                }));
            }
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleInputCheckboxChange = (e) => {
        handleCheckboxChange(e)
        handleInputChange(e)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        const {poster, trailer, ...restData} = formData;

        formDataToSend.append(
            'trainingCourseFields',
            new Blob([JSON.stringify({
                ...restData,
                categories: selectedOptions,
            })], {type: 'application/json'})
        );

        formDataToSend.append("poster", poster, poster.name)
        formDataToSend.append("trailer", trailer, trailer.name)

        try {
            const response = await axios.post('http://localhost:8080/api/training-course/create', formDataToSend, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            console.log(response.data)
        } catch (error) {
            console.error('Error adding movie:', error.response.data);
        }
    };

    const trainingStepData = {
        stepId: 1,
        image: formData.trailer
    };

    const trainingStepData2 = {
        stepId: 2,
        image: formData.poster
    };


    return (
        <div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>

                    <div className="input-wrapper">
                        <input type="text"
                               className="input-box"
                               placeholder="name"
                               name="name"
                               value={formData.name}
                               onChange={handleInputChange}
                        />
                        <span className="underline"></span>
                    </div>

                    <div className="input-wrapper">
                        <textarea placeholder="description"
                                  className="input-box input-area-desc"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-wrapper">
                        <input type="number"
                               placeholder="price"
                               className="input-box"
                               name="price"
                               value={formData.price}
                               onChange={handleInputChange}
                        />
                        <span className="underline"></span>
                    </div>

                    <input type="file"
                           name="poster"
                           onChange={handleInputChange}
                    />

                    <input type="file"
                           name="trailer"
                           onChange={handleInputChange}
                    />


                    <h3>Спортивные категории:</h3>
                    {categoryOptions.map((option) => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={handleInputCheckboxChange}
                                name="categories"
                            />
                            {option}
                        </label>
                    ))}
                    <br/>

                    <div className="training-step-container">
                        <div className="input-wrapper">
                            <input type="text"
                                   className="input-box"
                                   placeholder="title"
                                   name="stepTitle"
                                   value={formData.name}
                                   onChange={handleInputChange}
                            />
                            <span className="underline"></span>
                        </div>
                        <div className="input-wrapper">
                        <textarea placeholder="description"
                                  className="input-box input-area-desc"
                                  name="stepDescription"
                                  value={formData.description}
                                  onChange={handleInputChange}
                        />
                        </div>

                        <input type="file"
                               name="stepImage"
                               onChange={handleInputChange}
                        />

                        <input type="file"
                               name="stepVideo"

                               onChange={handleInputChange}
                        />
                    </div>


                    <button>Создать</button>
                </form>
            </div>

        </div>
    );
};

export default CreateTrainingCourse;
