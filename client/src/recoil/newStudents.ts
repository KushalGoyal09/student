import { atom, selector } from "recoil";
import { tokenAtom } from "./userAtom";
import axios from "axios";

interface Student {
    id: string;
    name: string;
    callNumber: string;
    dropperStatus: string;
    previousScore: string;
    platform: string;
    createdAt: Date;
}

const fetchStudents = async (token: string): Promise<Student[]> => {
    try {
        const { data } = await axios.get(
            "http://148.135.136.98:8080/api/new/students",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return data.data;
    } catch (error) {
        return [];
    }
};

const newStudents = atom({
    key: "newStudents",
    default: selector({
        key: "newStudents/default",
        get: async ({ get }) => {
            const tokenValue = get(tokenAtom);
            if (!tokenValue) {
                return [];
            }
            return await fetchStudents(tokenValue);
        },
    }),
});

export default newStudents;
