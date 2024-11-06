import './styles/App.css';
import React  from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import TrainingCourseDetail from "./components/course/TrainingCourseDetail";
import CreateTrainingCourse from "./components/CreateTrainingCourse";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path={"/"} element={<Main />}/>
              <Route path={"/course/detail/:id"} element={<TrainingCourseDetail />}/>
              <Route path={"/create-course"} element={<CreateTrainingCourse />}/>
          </Routes>

      </BrowserRouter>
  )
}

export default App;
