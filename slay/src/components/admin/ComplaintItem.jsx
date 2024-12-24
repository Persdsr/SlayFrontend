import React from 'react';

const ComplaintItem = ({complaint}) => {
    return (
        <a href={`complaint/${complaint?.id}`} key={complaint?.id}>
            <div
                className={complaint?.resolved ? "support-info-resolved-block" : "support-info-block"}>
                <div className="support-sender-info">
                    <h2>
                        {complaint?.description?.slice(0, 100)} ({complaint?.complaintType})
                    </h2>
                    <h3>{complaint?.sender}</h3>

                </div>
                <div className="support-detail">
                    <p>{complaint?.description?.slice(0, 250)}...</p>
                </div>
            </div>
        </a>
    );
};

export default ComplaintItem;