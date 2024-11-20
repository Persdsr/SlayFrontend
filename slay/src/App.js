import './styles/App.css';
import React  from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import TrainingCourseDetail from "./components/course/TrainingCourseDetail";
import CreateTrainingCourse from "./components/CreateTrainingCourse";
import CoursesCatalog from "./components/CoursesCatalog";
import Support from "./pages/Support";
import About from "./pages/About";
import Profile from "./pages/Profile";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path={"/"} element={<Main />}/>
              <Route path={"/course/detail/:id"} element={<TrainingCourseDetail />}/>
              <Route path={"/create-course"} element={<CreateTrainingCourse />}/>
              <Route path={"/courses"} element={<CoursesCatalog />}/>
              <Route path={"/support"} element={<Support />}/>
              <Route path={"/about"} element={<About />}/>
              <Route path={"/:username"} element={<Profile />}/>
          </Routes>

      </BrowserRouter>
  )
}

export default App;
