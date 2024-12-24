import React, {useEffect, useState} from 'react';
import {format} from "date-fns";
import MessageSupportItem from "./MessageSupportItem";
import AdminService from "../../service/AdminService";
import {useNavigate, useParams} from "react-router-dom";
import SupportService from "../../service/SupportService";
import ComplaintService from "../../service/ComplaintService";
import ComplaintCourseItem from "./complaint/ComplaintCourseItem";
import ComplaintUserItem from "./complaint/ComplaintUserItem";

const AdminComplaintDetail = () => {
    const [complaint, setComplaint] = useState([]);
    const params = useParams()
    const navigate = useNavigate();
    const [complaintTypes, setComplaintTypes] = useState([]);

    useEffect(() => {
        const fetchSupportDetail = async () => {
            try {
                const response = await AdminService.getComplaintDetailById(params?.complaintId)
                setComplaint(response)
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }

            const types = await ComplaintService.getComplaintTypes();
            setComplaintTypes(types);
        };

        fetchSupportDetail();
    }, [params.supportId]);

    const changeComplaintResolvedStatus = async() => {
        if (window.confirm("Вы уверены, что хотите закрыть/открыть запрос?")) {
            await ComplaintService.changeResolvedStatusComplaint(params.complaintId)

            window.location.reload();
        }
    };

    const closeComplaintAndBanUser = async () => {
        if (window.confirm("Вы уверены, что хотите закрыть/открыть запрос?")) {
            await ComplaintService.changeResolvedStatusComplaintAndBlockUser(params.complaintId, true)

            window.location.reload();
        }
    }

    return (
        <div className="complaint-container">
            <ul className="complaint-detail-info">
                <li>
                    <h2 className="support-detail-title">Тип жалобы</h2>
                    <span>{complaint.complaintType}</span>
                </li>
                <li>
                    <h2 className="support-detail-title">Отправить</h2>
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
                        if (complaint.complaintType === complaintTypes.USER_MESSAGE) {
                            return (
                                <p>1</p>
                            )
                        } else if (complaint.complaintType === complaintTypes.USER_PROFILE) {
                            return (
                                <ComplaintUserItem complaint={complaint}/>
                            )

                        } else if (complaint.complaintType === complaintTypes.COURSE) {
                            return (
                                <ComplaintCourseItem complaint={complaint}/>
                            )
                        }
                    })()
                }
                <h2 className="complaint-detail-title">Описание жалобы</h2>
                <span>
                {complaint.description}
            </span>
            </div>

            <div className="complaint-panel">

                <a onClick={changeComplaintResolvedStatus}>
                    <button className="btn close-btn">
                        {complaint.resolved ? "Открыть жалобу" : "Закрыть жалобу"}
                    </button>
                </a>


                {complaint.complaintType === complaintTypes.USER_PROFILE && (

                    <a onClick={closeComplaintAndBanUser}>
                        <button className="btn block-btn">
                            {complaint.banned
                                ? "Разблокировать пользователя"
                                : "Закрыть запрос и заблокировать пользователя"}
                        </button>
                    </a>
                )}

            </div>

        </div>
    );
};

export default AdminComplaintDetail;