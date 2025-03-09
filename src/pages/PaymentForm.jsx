import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('RUB');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentRequest = {
            amount,
            currency,
            description,
            returnUrl: "http://localhost:3000/payment-success"  // URL для возврата
        };

        try {
            const response = await axios.post('http://localhost:8080/api/payment/create', paymentRequest);
            const confirmationUrl = JSON.parse(response.data).confirmation.confirmation_url;
            window.location.href = confirmationUrl;  // Перенаправляем на страницу ЮKassa
        } catch (error) {
            console.error('Ошибка:', error);
            alert("Ошибка при создании платежа: " + error.response?.data);
        }
    };

    return (


            <form className="yoomoney-payment-form" action="https://yookassa.ru/integration/simplepay/payment"
                  method="post" accept-charset="utf-8">


                <div className="ym-hidden-inputs">
                    <input name="shopSuccessURL" type="hidden" value="http://localhost:3000"/>
                    <input name="shopFailURL" type="hidden" value="/"/>

                </div>


                <div className="ym-payment-btn-block">
                    <div className="ym-input-icon-rub ym-display-none">
                        <input name="sum" placeholder="0.00" className="ym-input ym-sum-input ym-required-input"
                               type="number" step="any" value="10"/>
                    </div>
                    <button data-text="Купить" className="ym-btn-pay ym-result-price"><span
                        className="ym-text-crop">Купить</span> <span className="ym-price-output"> 10,00&nbsp;₽</span>
                    </button>
                    <img src="https://yookassa.ru/integration/simplepay/img/iokassa-gray.svg?v=1.23.0"
                         className="ym-logo" width="114" height="27" alt="ЮKassa"/>
                </div>
                <input name="shopId" type="hidden" value="1024885"/>
            </form>


    );
};

export default PaymentForm;