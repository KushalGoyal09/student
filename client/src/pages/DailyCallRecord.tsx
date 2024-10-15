import { useMemo } from "react";
import { format } from "date-fns";
import {
    PhoneIcon,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Student {
    id: string;
    name: string;
    whattsapNumber: string;
    callNumber: string;
    class: string;
    dropperStatus: string;
    previousScore: string;
    platform: string;
    status: boolean;
    whattsapGroupLink: string | null;
}

type CallStatus = "Scheduled" | "Done" | "DNP" | "Nothing";

interface DetailedDailySummaryProps {
    students: Student[];
    callStatuses: Map<string, CallStatus>;
}

export default function DetailedDailySummary({
    students,
    callStatuses,
}: DetailedDailySummaryProps) {
    const todaysSummary = useMemo(() => {
        const today = format(new Date(), "yyyy-MM-dd");
        const toCall: Student[] = [];
        const done: Student[] = [];
        const dnp: Student[] = [];

        students.forEach((student) => {
            const status = callStatuses.get(`${student.id}-${today}`);
            if (status === "Scheduled") toCall.push(student);
            else if (status === "Done") done.push(student);
            else if (status === "DNP") dnp.push(student);
        });

        return { toCall, done, dnp };
    }, [students, callStatuses]);

    const renderStudentList = (students: Student[], icon: React.ReactNode) => (
        <ul className="space-y-2">
            {students.map((student) => (
                <li
                    key={student.id}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                    <span className="flex items-center">
                        {icon}
                        <span className="ml-2">{student.name}</span>
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            window.open(student.whattsapGroupLink || "")
                        }
                        aria-label={`Call ${student.name}`}
                    >
                        <PhoneIcon className="h-4 w-4" />
                    </Button>
                </li>
            ))}
        </ul>
    );

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    Today's Detailed Schedule -{" "}
                    {format(new Date(), "MMMM d, yyyy")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                            To Call ({todaysSummary.toCall.length})
                        </h3>
                        {renderStudentList(
                            todaysSummary.toCall,
                            <AlertCircle className="h-4 w-4 text-yellow-500" />,
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            Done ({todaysSummary.done.length})
                        </h3>
                        {renderStudentList(
                            todaysSummary.done,
                            <CheckCircle className="h-4 w-4 text-green-500" />,
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                            <XCircle className="mr-2 h-5 w-5 text-red-500" />
                            DNP ({todaysSummary.dnp.length})
                        </h3>
                        {renderStudentList(
                            todaysSummary.dnp,
                            <XCircle className="h-4 w-4 text-red-500" />,
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
