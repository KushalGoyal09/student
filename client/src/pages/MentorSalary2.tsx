"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    getAllGm,
    getAllSm,
    getAllemployes,
    getCommonSalaryDetails,
    setCommonSalaryDetails,
    getSalaryDetails,
    editSalary,
    GroupMentor,
    SeniorMentor,
    Employee,
    CommonSalary,
    Salary,
    Role,
    Month,
    months,
} from "./salaryUtils";

export default function MentorSalaryPage() {
    const [activeTab, setActiveTab] = useState<Role>("GroupMentor");
    const [month, setMonth] = useState<Month>(
        months[new Date().getMonth()] as Month,
    );
    const [year, setYear] = useState(new Date().getFullYear());
    const [mentors, setMentors] = useState<
        (GroupMentor | SeniorMentor | Employee)[]
    >([]);
    const [commonSalary, setCommonSalary] = useState<CommonSalary | null>(null);
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [totalToPay, setTotalToPay] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    useEffect(() => {
        fetchData();
    }, [activeTab, month, year]);

    const fetchData = async () => {
        let fetchedMentors: (GroupMentor | SeniorMentor | Employee)[] = [];
        if (activeTab === "GroupMentor") {
            fetchedMentors = await getAllGm();
        } else if (activeTab === "SeniorMentor") {
            fetchedMentors = await getAllSm();
        } else {
            fetchedMentors = await getAllemployes();
        }
        setMentors(fetchedMentors);

        const commonSalaryData = await getCommonSalaryDetails(activeTab);
        setCommonSalary(
            commonSalaryData || {
                baseSalary: 0,
                perAj: 0,
                payAccordingToRating: false,
                perAjLess: 0,
                perAjMore: 0,
            },
        );

        const salaryData = await getSalaryDetails(month, year, activeTab);
        setSalaries(salaryData);

        calculateTotals(salaryData);
    };

    const calculateTotals = (salaryData: Salary[]) => {
        const toPay = salaryData
            .filter((salary) => !salary.paid)
            .reduce(
                (sum, salary) => sum + salary.totalSalary + salary.bonus,
                0,
            );

        const paid = salaryData
            .filter((salary) => salary.paid)
            .reduce(
                (sum, salary) => sum + salary.totalSalary + salary.bonus,
                0,
            );
        setTotalToPay(toPay);
        setTotalPaid(paid);
    };

    const handleCommonSalaryChange = async () => {
        if (commonSalary) {
            await setCommonSalaryDetails(
                activeTab,
                commonSalary.perAj || 0,
                commonSalary.perAjLess || 0,
                commonSalary.perAjMore || 0,
                commonSalary.payAccordingToRating ? true : false,
                commonSalary.baseSalary || 0,
            );
        }
    };

    const calculateSalary = (
        mentor: GroupMentor | SeniorMentor | Employee,
    ): number => {
        if (activeTab === "Employee" || !commonSalary) return 0;

        const {
            baseSalary,
            perAj,
            payAccordingToRating,
            perAjLess,
            perAjMore,
        } = commonSalary;
        const { studentCount, overallRating } = mentor as
            | GroupMentor
            | SeniorMentor;

        let salary = baseSalary || 0;

        if (payAccordingToRating) {
            salary +=
                studentCount *
                (overallRating >= 4.5 ? perAjMore || 0 : perAjLess || 0);
        } else {
            salary += studentCount * (perAj || 0);
        }

        return salary;
    };

    const handleSalaryEdit = async (
        userId: string,
        totalSalary: number,
        bonus: number,
        paid: boolean,
    ) => {
        await editSalary(
            month,
            year,
            userId,
            totalSalary,
            bonus,
            paid,
            activeTab,
        );
        fetchData();
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">SALARY MANAGEMENT</h1>

            <div className="flex flex-col sm:flex-row gap-4">
                <Select
                    value={month}
                    onValueChange={(value) => setMonth(value as Month)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m} value={m}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full sm:w-[120px]"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Total to Pay
                        </p>
                        <p className="text-2xl font-bold">
                            ₹ {totalToPay.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Total Paid
                        </p>
                        <p className="text-2xl font-bold">
                            ₹ {totalPaid.toFixed(2)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as Role)}
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="GroupMentor">GM</TabsTrigger>
                    <TabsTrigger value="SeniorMentor">SM</TabsTrigger>
                    <TabsTrigger value="Employee">Others</TabsTrigger>
                </TabsList>

                {["GroupMentor", "SeniorMentor", "Employee"].map((role) => (
                    <TabsContent key={role} value={role}>
                        {role !== "Employee" && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>
                                        Common Salary Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        <Input
                                            type="number"
                                            value={
                                                commonSalary?.baseSalary || 0
                                            }
                                            onChange={(e) =>
                                                //@ts-ignore
                                                setCommonSalary({
                                                    //@ts-ignore
                                                    ...commonSalary,
                                                    baseSalary: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            placeholder="Base Salary"
                                        />
                                        <Input
                                            type="number"
                                            value={commonSalary?.perAj || 0}
                                            onChange={(e) =>
                                                //@ts-ignore
                                                setCommonSalary({
                                                    //@ts-ignore
                                                    ...commonSalary,
                                                    perAj: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            placeholder="Per AJ"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="payAsRating"
                                            checked={
                                                commonSalary?.payAccordingToRating ||
                                                false
                                            }
                                            //@ts-ignore
                                            onCheckedChange={(checked) =>
                                                //@ts-ignore
                                                setCommonSalary({
                                                    //@ts-ignore
                                                    ...commonSalary,
                                                    payAccordingToRating:
                                                        checked as boolean,
                                                })
                                            }
                                        />
                                        <label htmlFor="payAsRating">
                                            Pay According to Rating
                                        </label>
                                    </div>
                                    {commonSalary?.payAccordingToRating && (
                                        <div className="flex flex-wrap gap-4">
                                            <Input
                                                type="number"
                                                value={
                                                    commonSalary?.perAjLess || 0
                                                }
                                                onChange={(e) =>
                                                    setCommonSalary({
                                                        ...commonSalary,
                                                        perAjLess: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                placeholder="Pay for Less than 4.5 rating"
                                            />
                                            <Input
                                                type="number"
                                                value={
                                                    commonSalary?.perAjMore || 0
                                                }
                                                onChange={(e) =>
                                                    setCommonSalary({
                                                        ...commonSalary,
                                                        perAjMore: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                placeholder="Pay for More than 4.5 rating"
                                            />
                                        </div>
                                    )}
                                    <Button onClick={handleCommonSalaryChange}>
                                        Save Common Salary Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 bg-background">
                                            Name
                                        </TableHead>
                                        {(role === "GroupMentor" ||
                                            role === "SeniorMentor") && (
                                            <>
                                                <TableHead>
                                                    Student Count
                                                </TableHead>
                                                <TableHead>
                                                    Overall Rating
                                                </TableHead>
                                            </>
                                        )}
                                        {role === "Employee" && (
                                            <TableHead>Phone Number</TableHead>
                                        )}
                                        <TableHead>Total Salary</TableHead>
                                        <TableHead>Bonus</TableHead>
                                        <TableHead>Paid</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mentors.map((mentor) => {
                                        const salary = salaries.find(
                                            (s) => s.userId === mentor.id,
                                        ) || {
                                            totalSalary: 0,
                                            bonus: 0,
                                            paid: false,
                                        };
                                        const calculatedSalary =
                                            role !== "Employee"
                                                ? calculateSalary(mentor)
                                                : 0;
                                        return (
                                            <TableRow key={mentor.id}>
                                                <TableCell className="sticky left-0 bg-background">
                                                    {mentor.name}
                                                </TableCell>
                                                {(role === "GroupMentor" ||
                                                    role ===
                                                        "SeniorMentor") && (
                                                    <>
                                                        <TableCell>
                                                            {
                                                                (
                                                                    mentor as
                                                                        | GroupMentor
                                                                        | SeniorMentor
                                                                ).studentCount
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {(
                                                                mentor as
                                                                    | GroupMentor
                                                                    | SeniorMentor
                                                            ).overallRating.toFixed(
                                                                2,
                                                            )}
                                                        </TableCell>
                                                    </>
                                                )}
                                                {role === "Employee" && (
                                                    <TableCell>
                                                        {
                                                            (mentor as Employee)
                                                                .phoneNumber
                                                        }
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    $
                                                    {(role !== "Employee"
                                                        ? calculatedSalary
                                                        : salary.totalSalary
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    ${salary.bonus.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {salary.paid ? "Yes" : "No"}
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Edit Salary
                                                                    for{" "}
                                                                    {
                                                                        mentor.name
                                                                    }
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="flex flex-col space-y-2">
                                                                    <label htmlFor="totalSalary">
                                                                        Total
                                                                        Salary
                                                                    </label>
                                                                    <Input
                                                                        id="totalSalary"
                                                                        type="number"
                                                                        value={
                                                                            role !==
                                                                            "Employee"
                                                                                ? calculatedSalary
                                                                                : salary.totalSalary
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setSalaries(
                                                                                salaries.map(
                                                                                    (
                                                                                        s,
                                                                                    ) =>
                                                                                        s.userId ===
                                                                                        mentor.id
                                                                                            ? {
                                                                                                  ...s,
                                                                                                  totalSalary:
                                                                                                      Number(
                                                                                                          e
                                                                                                              .target
                                                                                                              .value,
                                                                                                      ),
                                                                                              }
                                                                                            : s,
                                                                                ),
                                                                            )
                                                                        }
                                                                        readOnly={
                                                                            role !==
                                                                            "Employee"
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col space-y-2">
                                                                    <label htmlFor="bonus">
                                                                        Bonus
                                                                    </label>
                                                                    <Input
                                                                        id="bonus"
                                                                        type="number"
                                                                        value={
                                                                            salary.bonus
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setSalaries(
                                                                                salaries.map(
                                                                                    (
                                                                                        s,
                                                                                    ) =>
                                                                                        s.userId ===
                                                                                        mentor.id
                                                                                            ? {
                                                                                                  ...s,
                                                                                                  bonus: Number(
                                                                                                      e
                                                                                                          .target
                                                                                                          .value,
                                                                                                  ),
                                                                                              }
                                                                                            : s,
                                                                                ),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id="paid"
                                                                        checked={
                                                                            salary.paid
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            setSalaries(
                                                                                salaries.map(
                                                                                    (
                                                                                        s,
                                                                                    ) =>
                                                                                        s.userId ===
                                                                                        mentor.id
                                                                                            ? {
                                                                                                  ...s,
                                                                                                  paid: checked as boolean,
                                                                                              }
                                                                                            : s,
                                                                                ),
                                                                            )
                                                                        }
                                                                    />
                                                                    <label htmlFor="paid">
                                                                        Paid
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                onClick={() =>
                                                                    handleSalaryEdit(
                                                                        mentor.id,
                                                                        role !==
                                                                            "Employee"
                                                                            ? calculatedSalary
                                                                            : salary.totalSalary,
                                                                        salary.bonus,
                                                                        salary.paid,
                                                                    )
                                                                }
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="ml-2"
                                                        onClick={() =>
                                                            handleSalaryEdit(
                                                                mentor.id,
                                                                role !==
                                                                    "Employee"
                                                                    ? calculatedSalary
                                                                    : salary.totalSalary,
                                                                salary.bonus,
                                                                !salary.paid,
                                                            )
                                                        }
                                                    >
                                                        <DollarSign className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
