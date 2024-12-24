import React from 'react';
import {format} from "date-fns";

const SupportItem = ({support}) => {
    return (
        <a href={`support/${support.id}`} key={support.id}>
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
                    {support?.messages[0]
                        ? <p>{support?.messages[0].message.slice(0, 150)}...</p>
                        : "-"
                    }
                </div>
            </div>
        </a>
    );
};

export default SupportItem;