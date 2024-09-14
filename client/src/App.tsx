import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Login from "./pages/Login/MentorLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import AddMentor from "./pages/Add/AddMentor";
import AddStudent from "./pages/Add/AddStudent";
import Mentor from "./pages/Mentors";
import AddTarget from "./pages/AddTarget";
import ChangePassword from "./pages/ChangePassword";
import AddSupervisor from "./pages/Add/AddSupervisor";
import AddSeniorMentorPage from "./pages/Add/AddSeniorMentor";
import MentorRatingPage from "./pages/SupervisorRating";
import SupervisorDetails from "./pages/SupervisorDetail";
import SMDetail from "./pages/SMDetail";
import SupervisorDetailMain from "./components/SupervisorDetailMain";
import SMDetailsMain from "./components/SMDetailMain";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/admin/login",
            element: <AdminLogin />,
        },
        {
            path: "/add-student",
            element: <AddStudent />,
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
            path: "/add-supervisor",
            element: <AddSupervisor/>
        },
        {
            path: "/add-senior-mentor",
            element: <AddSeniorMentorPage/>
        },
        {
            path: "/add-mentor",
            element: <AddMentor />,
        },
        {
            path: "/mentor-rating",
            element: <MentorRatingPage/>
        },
        {
            path: "/supervisorDetail",
            element: <SupervisorDetails/>,
            children: [
                {
                    path: ":username",
                    element: <SupervisorDetailMain/>
                },
            ]
        },
        {
            path: "/seniorMentorDetail",
            element: <SMDetail/>,
            children: [
                {
                    path: ":username",
                    element: <SMDetailsMain/>
                },
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
