import axios from "axios";
import { atom, selector } from "recoil";
import { tokenAtom } from "./userAtom";

interface Student {
    id: string;
    name: string;
    status: boolean;
    whattsapNumber: string;
    class: string;
    platform: string;
    dropperStatus: string;
    previousScore: string;
    whattsapGroupLink: string | null;
}

const fetchStudents = async (token: string): Promise<Student[]> => {
    try {
        const { data } = await axios.get(
            "https://thepcbpoint.com/api/detail/students",
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

const existingStudents = atom({
    key: "existingStudents",
    default: selector({
        key: "existingStudents/default",
        get: async ({ get }) => {
            const tokenValue = get(tokenAtom);
            if (!tokenValue) {
                return [];
            }
            return await fetchStudents(tokenValue);
        },
    }),
});

export default existingStudents;
