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
import TrainingCourseSearch from "./components/course/TrainingCourseSearch";

function App() {
    const authStore = useAuthStore();

    useEffect(() => {
        const fetchRequestTypes = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.log("The user is not logged in");
                return;
            }
            if (token) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/userinfo`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    authStore.setAuth(response.data);
                } catch (error) {
                    console.error("Error when receiving user information:", error);
                }
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
                <Route path="/course/:id" element={<TrainingCourseDetail />} />
                <Route path="/create-course" element={<CreateTrainingCourse />} />
                <Route path="/search/:searchQuery" element={<TrainingCourseSearch />} />
                <Route path="/search" element={<Main />} />
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
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
