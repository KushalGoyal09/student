import axios from "axios";

export interface GroupMentor {
    id: string;
    username: string;
    name: string;
    studentCount: number;
    overallRating: number;
}

export interface SeniorMentor {
    id: string;
    username: string;
    name: string;
    studentCount: number;
    overallRating: number;
}

export interface Employee {
    id: string;
    name: string;
    phoneNumber: string;
}

export interface Salary {
    id: string;
    userId: string;
    totalSalary: number;
    bonus: number;
    paid: boolean;
}

export interface CommonSalary {
    baseSalary: number;
    perAj: number;
    payAccordingToRating: boolean;
    perAjLess: number;
    perAjMore: number;
}

export type Role = "GroupMentor" | "SeniorMentor" | "Employee";

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const getAllGm = async (): Promise<GroupMentor[]> => {
    const { data } = await axios.get("/api/salary/get-mentors", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return data.data;
};

export const getAllSm = async (): Promise<SeniorMentor[]> => {
    const { data } = await axios.get("/api/salary/get-seniors", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return data.data;
};

export const getAllemployes = async (): Promise<Employee[]> => {
    const { data } = await axios.get("/api/salary/get-employes", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return data.data;
};

export const getCommonSalaryDetails = async (
    role: Role,
): Promise<CommonSalary | null> => {
    const { data } = await axios.post(
        "/api/salary/get-common",
        {
            salaryRole: role,
        },
        {
            headers: {
                Authorization: `Baerer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

export const setCommonSalaryDetails = async (
    salaryRole: Role,
    perAj: number,
    perAjLess: number,
    perAjMore: number,
    payAccordingToRating: boolean,
    baseSalary: number,
) => {
    await axios.post(
        "/api/salary/set-common",
        {
            salaryRole,
            perAj,
            perAjLess,
            perAjMore,
            payAccordingToRating,
            baseSalary,
        },
        {
            headers: {
                Authorization: `Baerer ${localStorage.getItem("token")}`,
            },
        },
    );
};

export type Month =
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";

export const getSalaryDetails = async (
    month: Month,
    year: number,
    salaryRole: Role,
): Promise<Salary[]> => {
    const { data } = await axios.post(
        "/api/salary/get-salary",
        {
            month,
            year,
            salaryRole,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

export const editSalary = async (
    month: Month,
    year: number,
    userId: string,
    totalSalary: number,
    bonus: number,
    paid: boolean,
    mentorType: Role,
) => {
    await axios.post(
        "/api/salary/edit-salary",
        {
            month,
            year,
            userId,
            totalSalary,
            bonus,
            paid,
            mentorType,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
};
