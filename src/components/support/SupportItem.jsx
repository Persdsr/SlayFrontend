import React from 'react';
import {format} from "date-fns";
import {Link} from "react-router-dom";

const SupportItem = ({support}) => {
    return (
        <Link to={`/support/${support.id}`} key={support.id}>
            <div
                className={support.resolved ? "support-info-resolved-block" : "support-info-block"}>
                <div className="support-sender-info">
                    <h2>
                        {support.subject} ({support.requestType})
                    </h2>
                    <h3>{support.senderUsername}</h3>
                    <div className="support-date">
                        {format(new Date(support.createAt), "yyyy.MM.dd hh:mm")}
                    </div>
                </div>
                <div className="support-detail">
                    {support?.messages.length
                        ?
                        <p>{support?.messages[support.messages.length - 1].message ? support?.messages[support.messages.length - 1].message.slice(0, 150) + ".." : "Изображение"}
                        </p>
                : "-"
                    }
                </div>
            </div>
        </Link>
    );
};

export default SupportItem;