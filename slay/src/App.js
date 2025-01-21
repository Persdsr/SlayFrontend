import './styles/App.css';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import TrainingCourseDetail from "./components/course/TrainingCourseDetail";
import CreateTrainingCourse from "./components/course/CreateTrainingCourse";
import CoursesCatalog from "./components/course/CoursesCatalog";
import CreateSupport from "./components/support/CreateSupport";
import About from "./pages/About";
import Profile from "./components/user/Profile";
import Admin from "./pages/Admin";
import AdminSupport from "./components/admin/AdminSupport";
import Complaints from "./components/admin/AdminComplaints";
import BannedUsers from "./components/admin/BannedUsers";
import SupportDetail from "./components/support/SupportDetail";
import ComplaintDetail from "./components/complaint/ComplaintDetail";
import MySupportRequests from "./components/support/MySupportRequests";
import MyComplaintsRequests from "./components/complaint/MyComplaintsRequests";
import axios from "axios";
import { useAuthStore } from "./components/store/store";
import NotFound from "./pages/NotFound";
import UserSettings from "./components/user/UserSettings";
import MyPurchaseCourses from "./components/user/MyPurchaseCourses";
import Messages from "./components/user/Messages";
import MessageDetail from "./components/user/MessageDetail";
import RedactTrainingCourse from "./components/course/RedactTrainingCourse";

function App() {
    const authStore = useAuthStore();

    useEffect(() => {
        const fetchRequestTypes = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.log("Пользователь не авторизован");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/auth/userinfo", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                authStore.setAuth(response.data);
            } catch (error) {
                console.error("Ошибка при получении информации о пользователе:", error);
            }
        };

        fetchRequestTypes();
    }, []);

    useEffect(() => {
        console.log(authStore.userData);
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/course/detail/:id" element={<TrainingCourseDetail />} />
                <Route path="/create-course" element={<CreateTrainingCourse />} />
                <Route path="/redact-course/:courseId" element={<RedactTrainingCourse />} />
                <Route path="/courses" element={<CoursesCatalog />} />
                <Route path="/support" element={<CreateSupport />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/about" element={<About />} />
                <Route path="/my-supports" element={<MySupportRequests />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message/:chatId" element={<MessageDetail />} />
                <Route path="/my-complaints" element={<MyComplaintsRequests />} />
                <Route path="/purchase-courses" element={<MyPurchaseCourses />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/support/:supportId" element={<SupportDetail />} />
                <Route path="/complaint/:complaintId" element={<ComplaintDetail />} />
                <Route path="/admin/complaints" element={<Complaints />} />
                <Route path="/admin/banned-users" element={<BannedUsers />} />
                <Route path="/profile/:username" element={<Profile />} /> {/* Должен быть в самом низу */}
                <Route path="*" element={<NotFound />} /> {/* Для всех некорректных URL */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
