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
import ChangePassword from "./pages/ChangePassword";
import MentorRatingPage from "./pages/SupervisorRating";
import SupervisorDetails from "./pages/SupervisorDetail";
import SMDetail from "./pages/SMDetail";
import SupervisorDetailMain from "./components/SupervisorDetailMain";
import SMDetailsMain from "./components/SMDetailMain";
import path from "path";

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
                    path: "supervisor",

                },
                {
                    path: "senior-mentor",

                },
                {
                    path: "mentor",

                },
                {
                    path: "student",

                }
            ]
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
            path: "/change-password",
            element: <ChangePassword />,
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
            element: <SMDetail />,
            children: [
                {
                    path: ":username",
                    element: <SMDetailsMain />,
                },
            ],
        },
        {
            path: "/mentor",
            children: [
                {
                    path: ":username",
                    
                }
            ]
        }
    ]);

    return (
        <>
            <Toaster />
            <RouterProvider router={router} />
        </>
    );
};

export default App;
