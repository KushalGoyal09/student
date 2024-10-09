import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon, LogOutIcon, LogInIcon } from "lucide-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tokenAtom, userAtom } from "@/recoil/userAtom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const navigate = useNavigate();
    const [role, setRole] = useRecoilState(userAtom);
    const setToken = useSetRecoilState(tokenAtom);

    const handleLogout = () => {
        console.log("Logging out");
        localStorage.removeItem("token");
        setRole(null);
        setToken(null);
        navigate("/");
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 p-3 flex items-center justify-between shadow-lg"
        >
            <div className="flex-1 flex items-center justify-start space-x-2">
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-white/20 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                </motion.div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/")}
                        className="text-white hover:bg-white/20 transition-colors duration-200"
                    >
                        <HomeIcon className="h-5 w-5 mr-2" />
                        <span className="hidden sm:inline">Home</span>
                    </Button>
                </motion.div>
            </div>

            <div className="flex-1 flex items-center justify-end">
                {role !== null ? (
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="relative"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-white hover:bg-white/20 transition-colors duration-200"
                        >
                            <LogOutIcon className="h-5 w-5 mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/login")}
                            className="text-white hover:bg-white/20 transition-colors duration-200"
                        >
                            <LogInIcon className="h-5 w-5 mr-2" />
                            <span className="hidden sm:inline">Login</span>
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
