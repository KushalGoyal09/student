import axios from "axios";
import { atom, selector } from "recoil";

export enum Role {
    superAdmin,
    admin,
    supervisor,
    seniorMentor,
    groupMentor,
    user,
}

interface Response {
    success: boolean;
    role: Role;
}

export const tokenAtom = atom({
    key: "token",
    default: localStorage.getItem("token"),
});

export const userAtom = atom({
    key: "userAtom",
    default: selector({
        key: "userAtom/default",
        get: async ({ get }) => {
            const tokenValue = get(tokenAtom);
            if (!tokenValue) {
                return null;
            }
            try {
                const { data } = await axios.get<Response>("/api/me", {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });
                if (data.role) {
                    return data.role;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        },
    }),
});
