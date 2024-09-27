import { Role, userAtom } from "@/recoil/userAtom";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useRecoilValue } from "recoil";

interface Links {
    role: Array<Role | null>;
    label: string;
    path: string;
}

const Home = () => {
    const role = useRecoilValue(userAtom);

    const links: Links[] = [
        {
            role: [null],
            label: "Login",
            path: "/login",
        },
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
            role: [
                Role.seniorMentor,
                Role.admin,
                Role.supervisor,
                Role.groupMentor,
            ],
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
            role: [Role.groupMentor, Role.seniorMentor, Role.supervisor, Role.admin],
            label: "See Syallabus",
            path: "/syallabus",
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">
                    Welcome to Our App
                </h1>
                <nav className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <ul className="space-y-2">
                        {links.map((link) => (
                            <Fragment key={link.path}>
                                {link.role.includes(role) && (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className="block w-full py-2 px-4 text-left text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-150 ease-in-out"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Home;
