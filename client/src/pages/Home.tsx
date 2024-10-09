import { Role, userAtom } from "@/recoil/userAtom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Loading from "@/components/Loading";
import AdminPanel from "./AdminPanel";
import WelcomeComponent from "./WelcomePage";

interface Links {
    label: string;
    path: string;
}

const Home = () => {
    const role = useRecoilValue(userAtom);
    const navigate = useNavigate();

    const links: Links[] = [
        {
            label: "Add Mentor",
            path: "/add/mentor",
        },
        {
            label: "Add Senior Mentor",
            path: "/add/senior-mentor",
        },
        {
            label: "Add Supervisor",
            path: "/add/supervisor",
        },
        {
            label: "Add Student",
            path: "/add/student",
        },
        {
            label: "See all supervisors",
            path: "/supervisor",
        },
        {
            label: "See all Senior Mentors",
            path: "/seniorMentor",
        },
        {
            label: "See all Mentors",
            path: "/mentor",
        },
        {
            label: "Active Juniors",
            path: "/students",
        },
        {
            label: "See all new admissions",
            path: "/new-admission",
        },
        {
            label: "Fees Data",
            path: "/fee-details",
        },
        {
            label: "Kit Distribution Data",
            path: "kit-data",
        },
        {
            label: "Change Password",
            path: "/admin/ChangePassword",
        },
        {
            label: "See Syallabus",
            path: "/syallabus",
        },
    ];

    useEffect(() => {
        if (role === Role.seniorMentor) {
            navigate("/students");
        } else if (role === Role.supervisor) {
            navigate("/students");
        } else if (role === Role.groupMentor) {
            navigate("/call-records");
        }
    }, [role, navigate]);

    if (role === null) {
        return <WelcomeComponent />;
    }
    if (role === Role.admin) {
        return <AdminPanel />;
    }

    return <Loading />;
};

export default Home;
