import React, {useEffect, useState} from 'react';
import {format} from "date-fns";
import MessageSupportItem from "../support/MessageSupportItem";
import AdminService from "../../service/AdminService";
import {useNavigate, useParams} from "react-router-dom";
import SupportService from "../../service/SupportService";
import ComplaintService from "../../service/ComplaintService";
import ComplaintCourseItem from "./ComplaintCourseItem";
import ComplaintUserItem from "./ComplaintUserItem";

const ComplaintDetail = () => {
    const [complaint, setComplaint] = useState([]);
    const params = useParams()
    const navigate = useNavigate();
    const [complaintTypes, setComplaintTypes] = useState([]);

    useEffect(() => {
        const fetchSupportDetail = async () => {
            try {
                const response = await ComplaintService.getComplaintDetailById(params?.complaintId)
                setComplaint(response)
                console.log(response)

            } catch (error) {
                navigate("/*")
            }

            const types = await ComplaintService.getComplaintTypes();
            setComplaintTypes(types);


        };

        fetchSupportDetail();
    }, [params.supportId]);

    const changeComplaintResolvedStatus = async () => {
        if (window.confirm("Вы уверены, что хотите закрыть/открыть запрос?")) {
            await ComplaintService.changeResolvedStatusComplaint(params.complaintId)

            window.location.reload()
        }
    };

    return (
        <div className="complaint-container">
            <ul className="complaint-detail-info">
                <li>
                    <h2 className="support-detail-title">Тип жалобы</h2>
                    <span>{complaint.localComplaintType}</span>
                </li>
                <li>
                    <h2 className="support-detail-title">Отправитель</h2>
                    <span>{complaint.sender}</span>
                </li>
                <li>
                    <h2 className="support-detail-title">Создан</h2>
                    <span>
                        {complaint.createdAt
                            ? format(new Date(complaint.createdAt), "dd-MM-yyyy hh:mm")
                            : "Дата недоступна"}
                    </span>
                </li>
                <li>
                    <h2 className="support-detail-title">Статус</h2>
                    {complaint.resolved ? <span>Закрыт</span> : <span>Открыт</span>}
                </li>
            </ul>

            <div className="complaint-content">

                {
                    (() => {
                        if (complaint?.localComplaintType === complaintTypes?.USER_MESSAGE) {
                            return (
                                <ComplaintCourseItem complaint={complaint}/>
                            )
                        } else if (complaint?.localComplaintType === complaintTypes?.USER_PROFILE) {
                            return (
                                <ComplaintUserItem complaint={complaint}/>
                            )

                        } else if (complaint?.localComplaintType === complaintTypes?.COURSE) {
                            return (
                                <ComplaintCourseItem complaint={complaint}/>
                            )
                        }
                    })()
                }
                <h2 className="complaint-detail-title">Описание жалобы</h2>
                <span style={{color: "white"}}>
                {complaint.description}
            </span>
            </div>

            <div className="complaint-panel">

                <a onClick={changeComplaintResolvedStatus}>
                    <button className="btn close-btn">
                        {complaint.resolved ? "Открыть жалобу" : "Закрыть жалобу"}
                    </button>
                </a>


            </div>

        </div>
    );
};

export default ComplaintDetail;