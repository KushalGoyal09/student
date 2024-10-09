import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Suspense, useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import Loading from "./Loading";
import { nameAtom, Role, userAtom } from "@/recoil/userAtom";
import WelcomeComponent from "./Welcome";
import Tiles from "./Tiles";

interface Links {
    role: Array<Role | null>;
    label: string;
    path: string;
}

const Layout = () => {
    const [name, setName] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const nameLoadable = useRecoilValueLoadable(nameAtom);
    const roleLoadable = useRecoilValueLoadable(userAtom);

    useEffect(() => {
        if (nameLoadable.state === "hasValue") {
            setName(nameLoadable.contents);
        }
    }, [nameLoadable]);

    useEffect(() => {
        if (roleLoadable.state === "hasValue") {
            setRole(roleLoadable.contents);
        }
    }, [roleLoadable]);

    const links: Links[] = [
        {
            role: [Role.admin],
            label: "Add Mentor",
            path: "/add/mentor",
        },
        {
            role: [Role.admin],
            label: "Add Senior Mentor",
            path: "/add/senior-mentor",
        },
        {
            role: [Role.admin],
            label: "Add Supervisor",
            path: "/add/supervisor",
        },
        {
            role: [Role.admin],
            label: "Add Student",
            path: "/add/student",
        },
        {
            role: [Role.admin],
            label: "See all supervisors",
            path: "/supervisor",
        },
        {
            role: [Role.supervisor, Role.admin],
            label: "See all Senior Mentors",
            path: "/seniorMentor",
        },
        {
            role: [Role.supervisor, Role.admin, Role.seniorMentor],
            label: "See all Mentors",
            path: "/mentor",
        },
        {
            role: [Role.seniorMentor, Role.admin, Role.supervisor],
            label: "See all Students",
            path: "/students",
        },
        {
            role: [Role.admin],
            label: "See all new admissions",
            path: "/new-admission",
        },
        {
            role: [Role.admin],
            label: "Fees Data",
            path: "/fee-details",
        },
        {
            role: [Role.admin],
            label: "Kit Distribution Data",
            path: "kit-data",
        },
        {
            role: [Role.admin],
            label: "Change Password",
            path: "/admin/ChangePassword",
        },
        {
            role: [Role.groupMentor],
            label: "See call records",
            path: "/call-records",
        },
        {
            role: [Role.seniorMentor, Role.supervisor, Role.admin],
            label: "See Syallabus",
            path: "/syllabus",
        },
        {
            role: [Role.groupMentor],
            label: "Target",
            path: "/target",
        },
        {
            role: [Role.supervisor],
            label: "Rate Mentor Performance",
            path: "/rating",
        },
        {
            role: [Role.groupMentor],
            label: "My Juniors",
            path: "/students",
        },
        {
            role: [Role.groupMentor],
            label: "Recent Feedbacks",
            path: "/mentor-feedback",
        },
        {
            role: [Role.groupMentor],
            label: "Syallabus",
            path: "/syllabus",
        },
        {
            role: [Role.groupMentor, Role.supervisor, Role.seniorMentor],
            label: "Raise a ticket",
            path: "/ticket/create",
        },
    ];

    const filteredLinks = links.filter((link) => link.role.includes(role));

    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                {name && role && <WelcomeComponent name={name} />}
                {role && role !== Role.admin && (
                    <Tiles filteredLinks={filteredLinks} />
                )}
                <Outlet />
            </div>
        </Suspense>
    );
};

export default Layout;
