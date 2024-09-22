import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";

type Payment = {
    amount: number;
    date: string;
    mode: string;
};

type FeeData = {
    totalAmountPaid: number;
    feesPlan?: string;
    allClear?: boolean;
    payments?: Payment[];
};

type Props = {
    studentId: string;
};

export default function FeeManagement({ studentId }: Props) {
    const [feeData, setFeeData] = useState<FeeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newPayment, setNewPayment] = useState<Payment>({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        mode: "UPI",
    });
    const { toast } = useToast();

    useEffect(() => {
        const fetchFeeData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(
                    `/api/new/fee-data`,
                    {
                        studentId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                setFeeData(data.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load fee data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeeData();
    }, [studentId, toast]);

    const handleAddPayment = async () => {
        setIsUpdating(true);
        try {
            const { data } = await axios.post(
                `/api/new/add-payment`,
                {
                    studentId,
                    payment: newPayment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            setFeeData(data.data);
            toast({
                title: "Success",
                description: "Payment added successfully.",
                variant: "default",
            });
            setNewPayment({
                amount: 0,
                date: new Date().toISOString().split("T")[0],
                mode: "UPI",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add payment. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateFee = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!feeData?.feesPlan) {
            toast({
                title: "Error",
                description: "Please select the Fee Plan.",
            });
            return;
        }
        setIsUpdating(true);
        try {
            const { data } = await axios.put(
                `/api/new/update-fee-details`,
                {
                    studentId,
                    feesPlan: feeData?.feesPlan,
                    allClear: feeData?.allClear,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            toast({
                title: "Success",
                description: "Fee details updated successfully.",
                variant: "default",
            });
            setFeeData(data.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update fee details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="w-full mt-6">
                <CardContent className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    if (!feeData) {
        return (
            <Card className="w-full mt-6">
                <CardContent className="p-6">
                    <p className="text-center text-gray-500">
                        No fee data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Fee Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdateFee} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="totalAmountPaid">
                            Total Amount Paid
                        </Label>
                        <Input
                            id="totalAmountPaid"
                            value={feeData.totalAmountPaid}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="feePlan">Fee Plan</Label>
                        <Select
                            value={feeData.feesPlan || ""}
                            onValueChange={(value) =>
                                setFeeData({ ...feeData, feesPlan: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Fee Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">One Time</SelectItem>
                                <SelectItem value="2">Two Time</SelectItem>
                                <SelectItem value="3">Three Time</SelectItem>
                                <SelectItem value="4">Four Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="allClear"
                            checked={feeData.allClear}
                            onCheckedChange={(checked) =>
                                setFeeData({ ...feeData, allClear: checked })
                            }
                        />
                        <Label htmlFor="allClear">All Clear</Label>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment History</Label>
                        <div className="space-y-2">
                            {feeData.payments &&
                                feeData.payments.map((payment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 text-sm"
                                    >
                                        <span>₹{payment.amount}</span>
                                        <span>
                                            {new Date(
                                                payment.date,
                                            ).toLocaleDateString()}
                                        </span>
                                        <span className="capitalize">
                                            {payment.mode}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Add New Payment</Label>
                        <div className="flex flex-col space-y-2">
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={newPayment.amount}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        amount: Number(e.target.value),
                                    })
                                }
                            />
                            <Input
                                type="date"
                                value={newPayment.date}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        date: e.target.value,
                                    })
                                }
                            />
                            <Input
                                type="text"
                                placeholder="Mode of Payment"
                                value={newPayment.mode}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        mode: e.target.value,
                                    })
                                }
                            />
                            <Button
                                type="button"
                                onClick={handleAddPayment}
                                className="w-full"
                                disabled={isUpdating}
                            >
                                <Plus className="w-4 h-4 mr-2" />{" "}
                                {isUpdating ? "Adding..." : "Add Payment"}
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Fee Details"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
