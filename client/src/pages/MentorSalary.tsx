import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "@/recoil/userAtom";

interface Mentor {
    id: string;
    username: string;
    name: string;
    studentCount: number;
    overallRating: number;
}

interface MentorSalary {
    userId: string;
    basePay: number;
    perStudentPay: number;
    paid: boolean;
}

export default function MentorSalaryManagement() {
    const [activeTab, setActiveTab] = useState<"group" | "senior">("group");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [salaries, setSalaries] = useState<MentorSalary[]>([]);
    const token = useRecoilValue(tokenAtom);

    const months = [
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

    useEffect(() => {
        fetchMentors();
        fetchSalaries();
    }, [activeTab, selectedMonth, selectedYear]);

    const getToken = () => {
        return token;
    };

    const fetchMentors = async () => {
        const endpoint =
            activeTab === "group"
                ? "/api/salary/get-mentors"
                : "/api/salary/get-seniors";
        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        const data = await response.json();
        if (data.success) {
            setMentors(data.data);
        }
    };

    const fetchSalaries = async () => {
        const endpoint =
            activeTab === "group"
                ? "/api/salary/get-mentor-salary"
                : "/api/salary/get-senior-salary";
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                month: months[selectedMonth],
                year: selectedYear,
            }),
        });
        const data = await response.json();
        if (data.success) {
            setSalaries(data.data);
        }
    };

    const handleSalaryEdit = async (
        userId: string,
        field: "basePay" | "perStudentPay" | "paid",
        value: number | boolean,
    ) => {
        let salary = salaries.find((s) => s.userId === userId);
        if (!salary) {
            salary = {
                basePay: 0,
                perStudentPay: 0,
                paid: false,
                userId: userId,
            };
        }
        const response = await fetch("/api/salary/edit-salary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                month: months[selectedMonth],
                year: selectedYear,
                userId,
                basePay: field === "basePay" ? value : salary.basePay,
                perStudentPay:
                    field === "perStudentPay" ? value : salary.perStudentPay,
                paid: field === "paid" ? value : salary.paid,
                mentorType:
                    activeTab === "group" ? "GroupMentor" : "SeniorMentor",
            }),
        });
        const data = await response.json();
        if (data.success) {
            setSalaries((prev) => {
                return prev.map((s) => {
                    if (s.userId === userId) {
                        return {
                            ...s,
                            [field]: value,
                        };
                    }
                    return s;
                });
            });
        }
    };

    const getTotalSalary = (mentor: Mentor, salary?: MentorSalary) => {
        if (!salary) return 0;
        return salary.basePay + salary.perStudentPay * mentor.studentCount;
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Mentor Salary Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "group" | "senior")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="group">Group Mentors</TabsTrigger>
                        <TabsTrigger value="senior">Senior Mentors</TabsTrigger>
                    </TabsList>
                    <div className="flex justify-between items-center my-4">
                        <Select
                            value={selectedMonth.toString()}
                            onValueChange={(value) =>
                                setSelectedMonth(parseInt(value))
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month, index) => (
                                    <SelectItem
                                        key={index}
                                        value={index.toString()}
                                    >
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(parseInt(e.target.value))
                            }
                            className="w-[100px] mt-2 sm:mt-0"
                        />
                    </div>
                    <TabsContent value="group">
                        <MentorTable
                            mentors={mentors}
                            salaries={salaries}
                            handleSalaryEdit={handleSalaryEdit}
                            getTotalSalary={getTotalSalary}
                        />
                    </TabsContent>
                    <TabsContent value="senior">
                        <MentorTable
                            mentors={mentors}
                            salaries={salaries}
                            handleSalaryEdit={handleSalaryEdit}
                            getTotalSalary={getTotalSalary}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function MentorTable({
    mentors,
    salaries,
    handleSalaryEdit,
    getTotalSalary,
}: {
    mentors: Mentor[];
    salaries: MentorSalary[];
    handleSalaryEdit: (
        userId: string,
        field: "basePay" | "perStudentPay" | "paid",
        value: number | boolean,
    ) => void;
    getTotalSalary: (mentor: Mentor, salary?: MentorSalary) => number;
}) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Base Pay</TableHead>
                        <TableHead>Per Student</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paid</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mentors.map((mentor) => {
                        const salary = salaries.find(
                            (s) => s.userId === mentor.id,
                        );
                        return (
                            <TableRow key={mentor.id}>
                                <TableCell>{mentor.name}</TableCell>
                                <TableCell>{mentor.studentCount}</TableCell>
                                <TableCell>
                                    {mentor.overallRating.toFixed(1)}
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={salary?.basePay || ""}
                                        onChange={(e) =>
                                            handleSalaryEdit(
                                                mentor.id,
                                                "basePay",
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-[100px]"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={salary?.perStudentPay || ""}
                                        onChange={(e) =>
                                            handleSalaryEdit(
                                                mentor.id,
                                                "perStudentPay",
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-[100px]"
                                    />
                                </TableCell>
                                <TableCell>
                                    {getTotalSalary(mentor, salary).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        className={
                                            salary?.paid
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handleSalaryEdit(
                                                mentor.id,
                                                "paid",
                                                !salary?.paid,
                                            )
                                        }
                                    >
                                        {salary?.paid ? (
                                            <span> Paid </span>
                                        ) : (
                                            <span>Not Paid</span>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
