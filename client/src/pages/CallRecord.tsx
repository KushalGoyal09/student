import { useState, useEffect } from "react";
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PhoneIcon,
    UserIcon,
    MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { endOfWeek, startOfWeek, addDays, format } from "date-fns";
import axios from "axios";
import { Link } from "react-router-dom";

enum CallStatusEnum {
    Scheduled = "Scheduled",
    Done = "Done",
    DNP = "DNP",
    Nothing = "Nothing",
}

interface ApiStudent {
    studentId: string;
    call: {
        date: Date;
        callStatus: CallStatusEnum;
    }[];
}

interface ApiResponse {
    data: {
        startDate: string;
        endDate: string;
        students: ApiStudent[];
    } | null;
    success: boolean;
    isWeek: boolean;
}

interface Student {
    id: string;
    name: string;
    whattsapNumber: string;
    callNumber: string;
}

const fetchWeekData = async (weekStart: string) => {
    const { data } = await axios.post<ApiResponse>(
        "/api/call/week-record",
        { startDay: weekStart },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

const fetchStudentsData = async () => {
    const { data } = await axios.get<{ data: Student[] }>(
        "/api/detail/students",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

const saveCallStatus = async (
    studentId: string,
    day: string,
    status: CallStatusEnum,
    date: string,
) => {
    await axios.post(
        "/api/call/save-call-status",
        { studentId, day, status, date },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
};

export default function WeekPlanner() {
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
    const [students, setStudents] = useState<Student[]>([]);
    const [callStatuses, setCallStatuses] = useState<
        Record<string, Record<string, CallStatusEnum>>
    >({});
    const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    useEffect(() => {
        fetchStudentsData().then((data) => setStudents(data));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
                .toISOString()
                .split("T")[0];
            const weekData = await fetchWeekData(weekStart);
            setCallStatuses(() => ({}));
            if (weekData) {
                const callStatusData: Record<
                    string,
                    Record<string, CallStatusEnum>
                > = {};
                students.forEach((student) => {
                    const calls =
                        weekData.students.find(
                            (s) => s.studentId === student.id,
                        )?.call || [];
                    callStatusData[student.id] = weekDays.reduce(
                        (acc, day, index) => {
                            const callDate = format(
                                addDays(weekStart, index),
                                "yyyy-MM-dd",
                            );
                            const callOnDay = calls.find(
                                (call) =>
                                    format(
                                        new Date(call.date),
                                        "yyyy-MM-dd",
                                    ) === callDate,
                            );
                            acc[day] = callOnDay
                                ? callOnDay.callStatus
                                : CallStatusEnum.Nothing;
                            return acc;
                        },
                        {} as Record<string, CallStatusEnum>,
                    );
                });
                setCallStatuses(callStatusData);
            }
        };
        if (students.length > 0) {
            fetchData();
        }
    }, [currentWeek, students]);

    const handlePreviousWeek = () => {
        setCurrentWeek((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentWeek((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const handleStatusChange = async (
        studentId: string,
        day: string,
        status: CallStatusEnum,
    ) => {
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
        const dayIndex = weekDays.indexOf(day);
        const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");

        setCallStatuses((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], [day]: status },
        }));
        await saveCallStatus(studentId, day, status, date);
    };

    const getStatusColor = (status: CallStatusEnum) => {
        switch (status) {
            case CallStatusEnum.Scheduled:
                return "bg-blue-100 text-blue-800";
            case CallStatusEnum.Done:
                return "bg-green-100 text-green-800";
            case CallStatusEnum.DNP:
                return "bg-red-100 text-red-800";
            case CallStatusEnum.Nothing:
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getWeekRange = () => {
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <Button
                    onClick={handlePreviousWeek}
                    variant="outline"
                    size="icon"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">{getWeekRange()}</span>
                </div>
                <Button onClick={handleNextWeek} variant="outline" size="icon">
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-4">
                {students.map((student) => (
                    <Card key={student.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                <span className="truncate">{student.name}</span>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            window.open(
                                                `tel:${student.callNumber}`,
                                            )
                                        }
                                    >
                                        <PhoneIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            window.open(
                                                `https://wa.me/${student.whattsapNumber}`,
                                            )
                                        }
                                    >
                                        <MessageCircleIcon className="h-4 w-4" />
                                    </Button>
                                    <Link to={`/profile/${student.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <UserIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardTitle>
                            <div className="text-sm text-muted-foreground truncate">
                                Call {student.callNumber}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                                WhatsApp {student.whattsapNumber}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="overflow-x-auto scrollbar-container"
                                style={{
                                    scrollbarWidth: "thin",
                                    WebkitOverflowScrolling: "touch",
                                }}
                            >
                                <div className="inline-flex space-x-4 pb-4">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="text-xs font-medium mb-1">
                                                {day}
                                            </div>
                                            <Select
                                                value={
                                                    callStatuses[student.id]?.[
                                                        day
                                                    ] || CallStatusEnum.Nothing
                                                }
                                                onValueChange={(
                                                    value: CallStatusEnum,
                                                ) =>
                                                    handleStatusChange(
                                                        student.id,
                                                        day,
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`w-[90px] ${getStatusColor(
                                                        callStatuses[
                                                            student.id
                                                        ]?.[day] ||
                                                            CallStatusEnum.Nothing,
                                                    )}`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={
                                                            CallStatusEnum.Nothing
                                                        }
                                                    >
                                                        Nothing
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            CallStatusEnum.Scheduled
                                                        }
                                                    >
                                                        Scheduled
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            CallStatusEnum.Done
                                                        }
                                                    >
                                                        Done
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            CallStatusEnum.DNP
                                                        }
                                                    >
                                                        DNP
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
