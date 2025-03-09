import './styles/App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import TrainingCourseDetail from './components/course/TrainingCourseDetail';
import CreateTrainingCourse from './components/course/CreateTrainingCourse';
import CoursesCatalog from './components/course/CoursesCatalog';
import CreateSupport from './components/support/CreateSupport';
import About from './pages/About';
import Profile from './components/user/Profile';
import Admin from './pages/Admin';
import AdminSupport from './components/admin/AdminSupport';
import Complaints from './components/admin/AdminComplaints';
import BannedUsers from './components/admin/BannedUsers';
import SupportDetail from './components/support/SupportDetail';
import ComplaintDetail from './components/complaint/ComplaintDetail';
import MySupportRequests from './components/support/MySupportRequests';
import MyComplaintsRequests from './components/complaint/MyComplaintsRequests';
import axios from 'axios';
import { useAuthStore } from './components/store/store';
import NotFound from './pages/NotFound';
import UserSettings from './components/user/UserSettings';
import MyPurchaseCourses from './components/user/MyPurchaseCourses';
import Messages from './components/user/Messages';
import ChatDetail from './components/user/ChatDetail';
import RedactTrainingCourse from './components/course/RedactTrainingCourse';
import TrainingCourseSearch from './components/course/TrainingCourseSearch';
import MyCourses from './components/user/MyCourses';
import ResetPassword from "./pages/ResetPassword";
import { Suspense } from "react";
import AdminSportCategory from "./components/admin/AdminSportCategory";
import LicenseAgreement from "./pages/LicenseAgreement";
import PaymentForm from "./pages/PaymentForm";

function App() {
  const authStore = useAuthStore();

  useEffect(() => {
    const cachedUserData = localStorage.getItem('userData');
    if (cachedUserData) {
      authStore.setAuth(JSON.parse(cachedUserData));
    }
  }, []);

  useEffect(() => {
    const fetchRequestTypes = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return;
      }

      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        authStore.setAuth(JSON.parse(cachedUserData));
        return;
      }

      try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/auth/userinfo`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        // Сохраняем данные о пользователе в localStorage
        localStorage.setItem('userData', JSON.stringify(response.data));
        authStore.setAuth(response.data);
      } catch (error) {
        console.error('Error when receiving user information:', error);
      }
    };

    fetchRequestTypes();
  }, []);

  return (
      <Suspense fallback={"...loading"}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/course/:id" element={<TrainingCourseDetail />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/create-course" element={<CreateTrainingCourse />} />
        <Route path="/search/:searchQuery" element={<TrainingCourseSearch />} />
        <Route path="/search" element={<Main />} />
        <Route path="/oferta" element={<LicenseAgreement />} />
        <Route
          path="/redact-course/:courseId"
          element={<RedactTrainingCourse />}
        />
        <Route path="/courses" element={<CoursesCatalog />} />
        <Route path="/support" element={<CreateSupport />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-supports" element={<MySupportRequests />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/message/:chatId" element={<ChatDetail />} />
        <Route path="/my-complaints" element={<MyComplaintsRequests />} />
        <Route path="/purchase-courses" element={<MyPurchaseCourses />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/sport-category" element={<AdminSportCategory />} />
        <Route path="/support/:supportId" element={<SupportDetail />} />
        <Route path="/complaint/:complaintId" element={<ComplaintDetail />} />
        <Route path="/admin/complaints" element={<Complaints />} />
        <Route path="/admin/banned-users" element={<BannedUsers />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
        </Suspense>
  );
}

export default App;
