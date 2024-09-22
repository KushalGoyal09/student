import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Payment {
    amount: number;
    date: Date;
    mode: string | null;
}

interface StudentFees {
    feesPlan: number;
    allClear: boolean;
    payments: Payment[];
}

interface Student {
    totalAmountPaid: number;
    id: string;
    name: string;
    createdAt: Date;
    Fees: StudentFees | null;
}

const FeeDetails = () => {
    const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
        new Set(),
    );
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get("/api/new/fee-data", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStudents(data.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load students. Please try again.",
                    variant: "destructive",
                });
            }
        };
        fetchStudents();
    },[]);

    const toggleExpand = (id: string) => {
        setExpandedStudents((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatPlan = (plan: number) => {
        if(plan === 0) {
            return "Not Set";
        } else {
            return `${plan} Time`;
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Student Fee Details
            </h1>
            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-4">
                    {students.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex justify-between items-center">
                                    <span>{student.name}</span>
                                    <Badge
                                        variant={
                                            student.Fees?.allClear
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {student.Fees?.allClear
                                            ? "Cleared"
                                            : "Pending"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p>
                                        Total Paid:{" "}
                                        {formatCurrency(
                                            student.totalAmountPaid,
                                        )}
                                    </p>
                                    <p>
                                        Created: {formatDate(student.createdAt)}
                                    </p>
                                    <p>
                                        Fee Plan:{" "}
                                        {formatPlan(
                                            student.Fees?.feesPlan || 0,
                                        )}
                                    </p>
                                    <Link
                                        to={`/profile/${student.id}`}
                                        className="text-primary hover:underline"
                                    >
                                        <Button variant={"default"} className="bg-slate-500"> View Profile </Button>
                                    </Link>
                                </div>
                                {student.Fees &&
                                    student.Fees.payments.length > 0 && (
                                        <div className="mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-between"
                                                onClick={() =>
                                                    toggleExpand(student.id)
                                                }
                                            >
                                                Payment History
                                                {expandedStudents.has(
                                                    student.id,
                                                ) ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                            {expandedStudents.has(
                                                student.id,
                                            ) && (
                                                <div className="mt-2 space-y-2">
                                                    {student.Fees.payments.map(
                                                        (payment, index) => (
                                                            <div
                                                                key={index}
                                                                className="text-sm border-t pt-2"
                                                            >
                                                                <p>
                                                                    Amount:{" "}
                                                                    {formatCurrency(
                                                                        payment.amount,
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    Date:{" "}
                                                                    {formatDate(
                                                                        payment.date,
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    Mode:{" "}
                                                                    {payment.mode ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FeeDetails;
