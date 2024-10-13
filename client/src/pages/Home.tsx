import { Role, userAtom } from "@/recoil/userAtom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Loading from "@/components/Loading";
import AdminPanel from "./AdminPanel";
import WelcomeComponent from "./WelcomePage";

const Home = () => {
    const role = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (role === Role.seniorMentor) {
            navigate("/juniors");
        } else if (role === Role.supervisor) {
            navigate("/juniors");
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
