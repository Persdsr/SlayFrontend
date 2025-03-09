import React from 'react';
import TrainingCourseService from "../../service/TrainingCourseService";

const CourseBuyModalContent = ({
                                   handleSubmit,
                                   register,
                                   navigate,
                                   courseId,
                                   authStore
                               }
) => {

    const onSubmit = async () => {
        if (authStore.authenticated) {
            const response = await TrainingCourseService.handleByCourse(courseId);
            if (response.status === 200) {
                window.location.reload();
            }
        } else {
            navigate("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
    <form className="yoomoney-payment-form" action="https://yookassa.ru/integration/simplepay/payment" method="post"
          accept-charset="utf-8">

        <div className="ym-hidden-inputs">
            <input name="shopSuccessURL" type="hidden" value="http://localhost:3000"/>
            <input name="shopFailURL" type="hidden" value="/"/>

        </div>

        <input name="customerNumber" type="hidden" value="Покупка тренировочного курса"/>

        <div className="ym-payment-btn-block">
            <div className="ym-input-icon-rub ym-display-none">
                <input name="sum" placeholder="0.00" className="ym-input ym-sum-input ym-required-input" type="number"
                       step="any" value="199"/>
            </div>
            <button data-text="Купить" className="ym-btn-pay ym-result-price"><span
                className="ym-text-crop">Купить</span> <span className="ym-price-output"> 199,00&nbsp;₽</span></button>
            <img src="https://yookassa.ru/integration/simplepay/img/iokassa-gray.svg?v=1.23.0" className="ym-logo"
                 width="114" height="27" alt="ЮKassa"/>
        </div>
        <input name="shopId" type="hidden" value="1024885"/></form>
)
    ;
};

export default CourseBuyModalContent;