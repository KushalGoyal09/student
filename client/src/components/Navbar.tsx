import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon, LogOutIcon } from "lucide-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tokenAtom, userAtom } from "@/recoil/userAtom";

export default function Navbar() {
    const navigate = useNavigate();
    const [role, setRole] = useRecoilState(userAtom);
    const setToken = useSetRecoilState(tokenAtom);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setRole(null);
        setToken(null);
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
            {role !== null && (
                <button
                    onClick={handleLogout}
                    className="text-white flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
                >
                    <LogOutIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            )}
            {role === null && <button></button>}
        </nav>
    );
}
