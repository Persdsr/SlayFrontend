import React from 'react';
import {Link} from "react-router-dom";
import {format} from "date-fns";

const ComplaintItem = ({complaint}) => {
    return (
        <Link
            to={`/complaint/${complaint?.id}`}
            className={complaint?.resolved ? "support-info-resolved-block" : "support-info-block"}
        >
            <div className="support-sender-info">
                <h2>
                    {complaint?.description?.slice(0, 100)} ({complaint?.complaintType})
                </h2>
                <h3>{complaint?.sender}</h3>
                <div className="support-date">
                    {format(new Date(complaint.createdAt), "yyyy.MM.dd hh:mm")}
                </div>
            </div>
            <div className="support-detail">
                <p>{complaint?.description?.slice(0, 250)}...</p>
            </div>
        </Link>
    );
};

export default ComplaintItem;