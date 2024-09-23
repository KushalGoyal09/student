import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon, LogOutIcon } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <button
                onClick={() => navigate(-1)}
                className="text-white flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back</span>
            </button>

            <button
                onClick={() => navigate("/")}
                className="text-white flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
            >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
            </button>

            <button
                onClick={handleLogout}
                className="text-white flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
            >
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </nav>
    );
}
