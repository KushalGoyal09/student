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
import Target from "./pages/Target/Target";
import ChangePassword from "./pages/Admin/ChangePassword";
import MentorRatingPage from "./pages/SupervisorRating";
import SupervisorDetails from "./pages/Detail/Supervisor/SupervisorDetail";
import SupervisorDetailMain from "./pages/Detail/Supervisor/SupervisorDetailMain";
import SeniorMentorDetail from "./pages/Detail/SeniorMentor/SeniorMentorDetail";
import SeniorMentorDetailMain from "./pages/Detail/SeniorMentor/SeniorMentorDetailMain";
import MentorDetail from "./pages/Detail/GroupMentor/MentorDetail";
import MentorDetailMain from "./pages/Detail/GroupMentor/MentorDetailMain";
import NotFound from "./pages/NotFound";
import { RecoilRoot } from "recoil";
import NewAdmissions from "./pages/New/NewAdmissions";
import FeeDetail from "./pages/New/FeeDetail";
import KitDispatchPage from "./pages/New/KitDetails2";
import Layout from "./components/Layout";
import MentorFeedback from "./pages/MentorFeedbacks";
import MentorPage from "./pages/MentorPage";
import AdminPanel from "./pages/AdminPanel";
import ComplaintTickets from "./pages/SeeAllTickets";
import Juniors from "./pages/Juniors";
import StudentProfile from "./pages/Profile/StudentProfile";
import CallRecord from "./pages/CallRecord2";
import MentorSalaryManagement from "./pages/MentorSalary2";
import RoleManagement from "./pages/RoleManagement";
import SyllabusComponent from "./pages/Syallabus/NeetSyallabus";
import Syallabus from "./pages/Syallabus/Syallabus";
import AddEmploy from "./pages/Add/AddEmploy";
import Ticket from "./pages/Ticket/Ticket";
import Employee from "./pages/Employee";

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
                    path: "/change-password",
                    element: <ChangePassword />,
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
                        {
                            path: "employee",
                            element: <AddEmploy/>
                        }
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
                    path: "mentor-feedback",
                    element: <MentorFeedback />,
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
                    // children: [
                    //     {
                    //         path: ":username",
                    //         element: <MentorDetailMain />,
                    //     },
                    // ],
                },
                {
                    path: "/mentor/:username",
                    element: <MentorDetailMain />,
                },
                {
                    path: "/AdminPanel",
                    element: <AdminPanel />,
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
                    // element: <WeekPlanner />,
                    element: <CallRecord />,
                },
                {
                    path: "/employes",
                    element: <Employee/>
                },
                {
                    path: "/syllabus",
                    element: <SyllabusComponent />,
                },
                {
                    path: "/admin/syllabus",
                    element: <Syallabus />,
                },
                {
                    path: "admin/mentor",
                    element: <MentorPage />,
                },
                {
                    path: "ticket/create",
                    element: <Ticket />,
                },
                {
                    path: "tickets",
                    element: <ComplaintTickets />,
                },
                {
                    path: "juniors",
                    element: <Juniors />,
                },
                {
                    path: "/salary",
                    element: <MentorSalaryManagement />,
                },
                {
                    path: "/role",
                    element: <RoleManagement />,
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
