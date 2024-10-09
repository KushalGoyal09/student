import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type Payment = {
    id: string;
    amount: number;
    date: string;
    mode: string | null;
    cleared: boolean;
};

type MentorshipPlan = "Elite" | "Pro" | "Max";

type FeeData = {
    totalAmountPaid: number;
    feesPlan: number;
    allClear: boolean;
    mentorshipPlan: MentorshipPlan;
    payments: Payment[];
};

type FeeDataResponse = {
    success: true;
    data: FeeData | null;
};

const defaultFeeStructure = {
    Elite: { 1: [12990], 2: [7500, 7500], 3: [5500, 5500, 3990] },
    Pro: { 1: [13999], 2: [7500, 7500], 3: [5500, 5500, 5000] },
    Max: { 1: [24999], 2: [15000, 15000] },
};

const fetchFeeData = async (studentId: string) => {
    const { data } = await axios.post<FeeDataResponse>(
        "/api/new/fee-data",
        { studentId },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

const setFeeStructure = async (
    studentId: string,
    feePlan: number,
    mentorshipPlan: MentorshipPlan,
    payments: Payment[],
) => {
    const { data } = await axios.post(
        "/api/new/set-fee-details",
        {
            studentId,
            feesPlan: feePlan,
            mentorshipPlan,
            payments,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data;
};

const addPayment = async (studentId: string, payment: Payment) => {
    const { data } = await axios.post(
        "/api/new/add-payment",
        {
            studentId,
            payment,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data;
};

const markFeeClear = async (studentId: string, allClear: boolean) => {
    const { data } = await axios.post(
        "/api/new/allClear",
        {
            studentId,
            allClear,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data;
};

export default function FeeDetailPage({ studentId }: { studentId: string }) {
    const [feeData, setFeeData] = useState<FeeData | null>(null);
    const [mentorshipPlan, setMentorshipPlan] = useState<MentorshipPlan>();
    const [feePlan, setFeePlan] = useState<number>();
    const [feeStructure, setFeeStructure] = useState(() => {
        if (!mentorshipPlan || !feePlan) {
            return null;
        } else {
            try {
                //@ts-ignore
                return defaultFeeStructure[mentorshipPlan][feePlan] as number[];
            } catch (error) {
                return null;
            }
        }
    });
    const [newPayment, setNewPayment] = useState<Omit<Payment, "id">>({
        amount: 0,
        date: format(new Date(), "yyyy-MM-dd"),
        mode: "",
        cleared: false,
    });

    useEffect(() => {
        fetchFeeData(studentId).then(setFeeData);
    }, [studentId]);

    const handleSetFeeStructure = async () => {
        if (!mentorshipPlan || !feePlan) {
            toast({
                title: "Please select mentorship plan and fee plan",
                variant: "destructive",
            });
            return;
        }
        const payments = generatePayments(mentorshipPlan, feePlan);
        try {
            await setFeeStructure(
                studentId,
                //@ts-ignore
                feeStructure[mentorshipPlan][feePlan],
                mentorshipPlan,
                payments,
            );
            toast({ title: "Fee structure set successfully" });
            fetchFeeData(studentId).then(setFeeData);
        } catch (error) {
            toast({
                title: "Error setting fee structure",
                variant: "destructive",
            });
        }
    };

    const handleAddPayment = async () => {
        try {
            await addPayment(studentId, {
                ...newPayment,
                id: Date.now().toString(),
            });
            toast({ title: "Payment added successfully" });
            fetchFeeData(studentId).then(setFeeData);
        } catch (error) {
            toast({ title: "Error adding payment", variant: "destructive" });
        }
    };

    const handleMarkFeeClear = async () => {
        try {
            await markFeeClear(studentId, true);
            toast({ title: "Fee marked as cleared" });
            fetchFeeData(studentId).then(setFeeData);
        } catch (error) {
            toast({
                title: "Error marking fee as cleared",
                variant: "destructive",
            });
        }
    };

    if (!feeData) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (!feeData.fee) {
        return (
            <Card className="w-full max-w-2xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Set Fee Structure</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSetFeeStructure();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="mentorshipPlan">
                                Mentorship Plan
                            </Label>
                            <Select
                                onValueChange={(value: MentorshipPlan) =>
                                    setMentorshipPlan(value)
                                }
                                value={mentorshipPlan}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Mentorship Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Elite">Elite</SelectItem>
                                    <SelectItem value="Pro">Pro</SelectItem>
                                    <SelectItem value="Max">Max</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="feePlan">Fee Plan</Label>
                            <RadioGroup
                                onValueChange={(
                                    value: "one" | "two" | "three",
                                ) => setFeePlan(value)}
                                value={feePlan}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one" id="one" />
                                    <Label htmlFor="one">
                                        One-time payment
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="two" id="two" />
                                    <Label htmlFor="two">
                                        Two installments
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="three" id="three" />
                                    <Label htmlFor="three">
                                        Three installments
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button type="submit">Set Fee Structure</Button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Fee Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p>
                                <strong>Mentorship Plan:</strong>{" "}
                                {feeData.fee.mentorshipPlan}
                            </p>
                            <p>
                                <strong>Fee Plan:</strong>{" "}
                                {feeData.fee.feesPlan}
                            </p>
                            <p>
                                <strong>Total Amount Paid:</strong> ₹
                                {feeData.totalAmountPaid}
                            </p>
                            <p>
                                <strong>All Clear:</strong>{" "}
                                {feeData.fee.allClear ? "Yes" : "No"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Payments</h3>
                            {feeData.fee.payments.map((payment, index) => (
                                <div key={payment.id} className="mb-2">
                                    <p>
                                        Payment {index + 1}: ₹{payment.amount}
                                    </p>
                                    <p>
                                        Date:{" "}
                                        {format(
                                            new Date(payment.date),
                                            "dd MMM yyyy",
                                        )}
                                    </p>
                                    <p>Mode: {payment.mode}</p>
                                    <p>
                                        Cleared:{" "}
                                        {payment.cleared ? "Yes" : "No"}
                                    </p>
                                    {!payment.cleared && (
                                        <p className="text-red-500">
                                            Due in{" "}
                                            {differenceInDays(
                                                new Date(payment.date),
                                                new Date(),
                                            )}{" "}
                                            days
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddPayment();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={newPayment.amount}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        amount: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={newPayment.date}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        date: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="mode">Mode</Label>
                            <Input
                                id="mode"
                                value={newPayment.mode || ""}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        mode: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="cleared"
                                type="checkbox"
                                checked={newPayment.cleared}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        cleared: e.target.checked,
                                    })
                                }
                            />
                            <Label htmlFor="cleared">Cleared</Label>
                        </div>
                        <Button type="submit">Add Payment</Button>
                    </form>
                </CardContent>
            </Card>

            {!feeData.fee.allClear && (
                <Button onClick={handleMarkFeeClear}>
                    Mark Fee as Cleared
                </Button>
            )}
        </div>
    );
}

// Helper function to generate payments based on the selected plan
function generatePayments(
    mentorshipPlan: MentorshipPlan,
    feePlan: "one" | "two" | "three",
): Payment[] {
    const amounts = feeStructure;
    const today = new Date();

    if (typeof amounts === "number") {
        return [
            {
                id: Date.now().toString(),
                amount: amounts,
                date: format(today, "yyyy-MM-dd"),
                mode: null,
                cleared: false,
            },
        ];
    }

    return amounts.map((amount, index) => ({
        id: (Date.now() + index).toString(),
        amount,
        date: format(
            new Date(today.setDate(today.getDate() + index * 45)),
            "yyyy-MM-dd",
        ),
        mode: null,
        cleared: false,
    }));
}
