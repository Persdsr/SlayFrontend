import React, {useEffect, useState} from 'react';

import ComplaintUserService from "../../../service/ComplaintUserService";

const ComplaintUserItem = ({complaint}) => {
    const [user, setUser] = useState([])

    useEffect(() => {

        const fetchCourse = async () => {
            const response = await ComplaintUserService.getComplaintUserById(complaint.id)
            setUser(response.reportedUser)

        }
        fetchCourse()

    }, []);
    return (
        <div className="complaint-user-container">
            <h2 className="complaint-detail-title">Пользователь</h2>
            <span>{user.username}</span>
            <a className="check-profile" href={`/${user.username}`}>Посмотреть профиль</a>
        </div>
    );
};

export default ComplaintUserItem;