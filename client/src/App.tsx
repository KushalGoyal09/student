import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import {
    MentorLogin,
    SeniorMentorLogin,
    AdminLogin,
    SupervisorLogin,
} from "./pages/Login";
import {
    AddMentor,
    AddSeniorMentor,
    AddStudent,
    AddSupervisor,
} from "./pages/Add";
import Mentor from "./pages/Mentors";
import AddTarget from "./pages/AddTarget";
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

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            children: [
                {
                    path: "mentor",
                    element: <MentorLogin />,
                },
                {
                    path: "supervisor",
                    element: <SupervisorLogin />,
                },
                {
                    path: "senior-mentor",
                    element: <SeniorMentorLogin />,
                },
                {
                    path: "admin",
                    element: <AdminLogin />,
                },
            ],
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
            path: "/admin/mentors",
            element: <Mentor />,
        },
        {
            path: "/target",
            element: <AddTarget />,
        },
        {
            path: "/mentor-rating",
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
            path: "/profile",
            children: [
                {
                    path: ":id",
                    element: <StudentProfile />,
                },
            ],
        },
        {
            path: "*",
            element: <NotFound />,
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
