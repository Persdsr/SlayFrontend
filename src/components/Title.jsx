import React, { useState } from 'react';
import AuthModal from './AuthModal';
import LoginModalContent from "./modal/LoginModalContent";
import RegisterModalContent from "./modal/RegisterModalContent";
import ForgotPasswordModalContent from "./modal/ForgotPasswordModalContent";

const Title = () => {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  return (
    <div className="title-block">
      <div className="title-info-block">
        <div className="title-block-content">
          <h1 className="title-block-text">
            <span className="title-block-slay">SLAY</span> - SPORT PLATFORM WITH PRACTICE COURSES
          </h1>
          <div className="title-buttons">
            <button
              className="title-block-button"
              onClick={() => setRegisterOpen(true)}
            >
              Sign Up
            </button>
            <button
              className="title-block-button"
              onClick={() => setLoginOpen(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="title-poster-block">
        <img src="/logo-man-tools_2.png" alt="" className="title-poster" />
      </div>

      <div className="title-detail-block">
        <ul>
          <li className="title-detail-text">
            <img src="/gym100.png" alt="Icon 1" className="list-icon" />
            Create your own courses or learn from your coaches – all in one place!
          </li>
          <li className="title-detail-text">
            <img src="/ganteli.png" alt="Icon 2" className="list-icon" />
            Choose from hundreds of courses and communicate directly with the trainers – your progress is in your hands!
          </li>
          <li className="title-detail-text">
            <img src="/icon-motivation.png" alt="Icon 3" className="list-icon" />
            Training videos that motivate, and courses that work – start changing today!
          </li>
        </ul>
      </div>

      <AuthModal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}
                 content={<RegisterModalContent
                  setLoginOpen={setLoginOpen}
                  errorMessage={errorMessage}
                  setRegisterOpen={setRegisterOpen}
                  setErrorMessage={setErrorMessage}
                 />
      }
      />

      <AuthModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}
                 content={<LoginModalContent
                          setLoginOpen={setLoginOpen}
                          errorMessage={errorMessage}
                          setErrorMessage={setErrorMessage}
                          setForgotPasswordOpen={setForgotPasswordOpen}
                          setRegisterOpen={setRegisterOpen}
                 />
      }
      />


      <AuthModal isOpen={isForgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}
                 content={<ForgotPasswordModalContent

                 />} />
    </div>
  );
};

export default Title;
