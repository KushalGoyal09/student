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

// get all the Group Mentors
export const getAllGm = async (): Promise<GroupMentor[]> => {
    const { data } = await axios.get(
        "https://thepcbpoint.com/api/salary/get-mentors",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

// get all the senior mentors
export const getAllSm = async (): Promise<SeniorMentor[]> => {
    const { data } = await axios.get(
        "https://thepcbpoint.com/api/salary/get-seniors",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

// get all the other employees
export const getAllemployes = async (): Promise<Employee[]> => {
    const { data } = await axios.get(
        "https://thepcbpoint.com/api/salary/get-employes",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

// for groupMentor and seniormentor - fetch the common salary setting.
// if it is null - assume it to be {
//     baseSalary: 0;
//     perAj: 0;
//     payAccordingToRating: boolean;
//     perAjLess: 0;
//     perAjMore: 0;
// }
// it is used to calculate the total salary of the group mentors and senior mentors
//
// totalSalary = perAj * Number of students + base pay + bonus (if the payAccordingToRating === false)
// totalSalary = perAjLess * Number of students + base pay + bonus (if the payAccordingToRating === false && overAll rating < 4.5)
// totalSalary = perAjMore * Number of students + base pay + bonus (if the payAccordingToRating === false && overAll rating >= 4.5)
export const getCommonSalaryDetails = async (
    role: Role,
): Promise<CommonSalary | null> => {
    const { data } = await axios.post(
        "https://thepcbpoint.com/api/salary/get-common",
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

// set or edit the common salary setting.
export const setCommonSalaryDetails = async (
    salaryRole: Role,
    perAj: number,
    perAjLess: number,
    perAjMore: number,
    payAccordingToRating: boolean,
    baseSalary: number,
) => {
    await axios.post(
        "https://thepcbpoint.com/api/salary/set-common",
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

// get salary details for the mentor, senior mentor and others
// if no enttry found for userId === id
// assume {
//     userId: id;
//     totalSalary: CalculatesThroughCommonSetting (if senior / group mentor) , 0 (if others);
//     bonus: 0;
//     paid: boolean;
// }
export const getSalaryDetails = async (
    month: Month,
    year: number,
    salaryRole: Role,
): Promise<Salary[]> => {
    const { data } = await axios.post(
        "https://thepcbpoint.com/api/salary/get-salary",
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

// edit the salary for a groupMentor, seniorMentor and employee
export const editSalary = async (
    month: Month,
    year: number,
    userId: string,
    totalSalary: number,
    bonus: number,
    paid: boolean,
    mentorType: Role,
): Promise<Salary> => {
    const { data } = await axios.post(
        "https://thepcbpoint.com/api/salary/edit-salary",
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
    return data.salary;
};
