import { tokenAtom, userAtom } from "@/recoil/userAtom";
import { redirect } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

const Navbar = () => {
    const [role, setRole] = useRecoilState(userAtom);
    const token = useSetRecoilState(tokenAtom);

    return (
        <>
            <div>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        token(null);
                        setRole(null);
                        redirect("/");
                    }}
                >
                    logout
                </button>
                <button>{role}</button>
            </div>
        </>
    );
};

export default Navbar;
