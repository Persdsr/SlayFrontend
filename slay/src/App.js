import './styles/App.css';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import TrainingCourseDetail from "./components/course/TrainingCourseDetail";
import CreateTrainingCourse from "./components/course/CreateTrainingCourse";
import CoursesCatalog from "./components/course/CoursesCatalog";
import Support from "./pages/Support";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminSupport from "./components/admin/AdminSupport";
import Complaints from "./components/admin/Complaints";
import BannedUsers from "./components/admin/BannedUsers";
import AdminSupportDetail from "./components/admin/AdminSupportDetail";
import AdminComplaintDetail from "./components/admin/AdminComplaintDetail";
import MySupportRequests from "./components/user/MySupportRequests";
import MyComplaintsRequests from "./components/user/MyComplaintsRequests";
import axios from "axios";
import { useAuthStore } from "./components/store/store";
import NotFound from "./pages/NotFound";
import UserSettings from "./pages/UserSettings";
import MyPurchaseCourses from "./components/user/MyPurchaseCourses";
import Messages from "./components/user/Messages";
import MessageDetail from "./components/user/MessageDetail";
import RedactTrainingCourse from "./components/course/RedactTrainingCourse";

function App() {
    const authStore = useAuthStore();

    useEffect(() => {
        const fetchRequestTypes = async () => {
            const response = await axios.get("http://localhost:8080/api/auth/userinfo", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Токен должен быть корректным
                },
            });
            authStore.setAuth(response.data);
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
                <Route path="/support" element={<Support />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/about" element={<About />} />
                <Route path="/my-supports" element={<MySupportRequests />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message/:chatId" element={<MessageDetail />} />
                <Route path="/my-complaints" element={<MyComplaintsRequests />} />
                <Route path="/purchase-courses" element={<MyPurchaseCourses />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/support/:supportId" element={<AdminSupportDetail />} />
                <Route path="/complaint/:complaintId" element={<AdminComplaintDetail />} />
                <Route path="/admin/complaints" element={<Complaints />} />
                <Route path="/admin/banned-users" element={<BannedUsers />} />
                <Route path="/profile/:username" element={<Profile />} /> {/* Должен быть в самом низу */}
                <Route path="*" element={<NotFound />} /> {/* Для всех некорректных URL */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
