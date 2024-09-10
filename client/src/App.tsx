import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AddMentor from "./pages/AddMentor";
import AddStudent from "./pages/AddStudent";
import Mentor from "./pages/Mentors";
import AddTarget from "./pages/AddTarget";

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
            path: "/admin/add-mentor",
            element: <AddMentor />,
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
    ]);

    return (
        <>
            <Toaster />
            <RouterProvider router={router} />
        </>
    );
};

export default App;
