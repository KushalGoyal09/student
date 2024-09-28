import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import {
    AddMentor,
    AddSeniorMentor,
    AddStudent,
    AddSupervisor,
} from "./pages/Add";
import Target from "./pages/AddTarget";
import ChangePassword from "./pages/Admin/ChangePassword";
import MentorRatingPage from "./pages/SupervisorRating";
import SupervisorDetails from "./pages/Detail/Supervisor/SupervisorDetail";
import SupervisorDetailMain from "./pages/Detail/Supervisor/SupervisorDetailMain";
import SeniorMentorDetail from "./pages/Detail/SeniorMentor/SeniorMentorDetail";
import SeniorMentorDetailMain from "./pages/Detail/SeniorMentor/SeniorMentorDetailMain";
import MentorDetail from "./pages/Detail/GroupMentor/MentorDetail";
import MentorDetailMain from "./pages/Detail/GroupMentor/MentorDetailMain";
import StudentProfile from "./pages/Profile/StudentProfile";
import NotFound from "./pages/NotFound";
import { RecoilRoot } from "recoil";
import NewAdmissions from "./pages/New/NewAdmissions";
import FeeDetail from "./pages/New/FeeDetail";
import KitDispatchPage from "./pages/New/KitDetails";
import StudentList from "./pages/Detail/StudentList";
import Layout from "./components/Layout";
import WeekPlanner from "./pages/CallRecord";
import Syallabus from "./pages/Syallabus";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/admin",
                    children: [
                        {
                            path: "ChangePassword",
                            element: <ChangePassword />,
                        },
                    ],
                },
                {
                    path: "/add",
                    children: [
                        {
                            path: "mentor",
                            element: <AddMentor />,
                        },
                        {
                            path: "student",
                            element: <AddStudent />,
                        },
                        {
                            path: "supervisor",
                            element: <AddSupervisor />,
                        },
                        {
                            path: "senior-mentor",
                            element: <AddSeniorMentor />,
                        },
                    ],
                },
                {
                    path: "/target",
                    element: <Target />,
                },
                {
                    path: "/rating",
                    element: <MentorRatingPage />,
                },
                {
                    path: "/supervisor",
                    element: <SupervisorDetails />,
                    children: [
                        {
                            path: ":username",
                            element: <SupervisorDetailMain />,
                        },
                    ],
                },
                {
                    path: "/seniorMentor",
                    element: <SeniorMentorDetail />,
                    children: [
                        {
                            path: ":username",
                            element: <SeniorMentorDetailMain />,
                        },
                    ],
                },
                {
                    path: "/mentor",
                    element: <MentorDetail />,
                    children: [
                        {
                            path: ":username",
                            element: <MentorDetailMain />,
                        },
                    ],
                },
                {
                    path: "/students",
                    element: <StudentList />,
                },
                {
                    path: "/profile",
                    children: [
                        {
                            path: ":id",
                            element: <StudentProfile />,
                        },
                    ],
                },
                {
                    path: "/new-admission",
                    element: <NewAdmissions />,
                },
                {
                    path: "/fee-details",
                    element: <FeeDetail />,
                },
                {
                    path: "/kit-data",
                    element: <KitDispatchPage />,
                },
                {
                    path: "/call-records",
                    element: <WeekPlanner />,
                },
                {
                    path: "/syallabus",
                    element: <Syallabus />,
                },
                {
                    path: "*",
                    element: <NotFound />,
                },
            ],
        },
    ]);

    return (
        <RecoilRoot>
            <Toaster />
            <RouterProvider router={router} />
        </RecoilRoot>
    );
};

export default App;
