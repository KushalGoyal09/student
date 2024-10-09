import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronDown, ChevronUp } from "lucide-react";

type Payment = {
    date: string;
    amount: number;
    mode: string | null;
    cleared: boolean;
};

type FeeDetail = {
    totalAmountPaid: number;
    name: string;
    id: string;
    createdAt: Date;
    Fees: {
        feesPlan: number;
        allClear: boolean;
        mentorshipPlan: string;
        payments: Payment[];
    } | null;
};

export default function FeeDetailsPage() {
    const [feeDetails, setFeeDetails] = useState<FeeDetail[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof FeeDetail;
        direction: "asc" | "desc";
    } | null>(null);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/new/fee-data", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setFeeDetails(data.data);
        };
        fetchData();
    }, []);

    const sortedFeeDetails = [...feeDetails].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        //@ts-ignore
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        //@ts-ignore
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const filteredFeeDetails = filter
        ? sortedFeeDetails.filter(
              (detail) => detail.Fees?.mentorshipPlan === filter,
          )
        : sortedFeeDetails;

    const handleSort = (key: keyof FeeDetail) => {
        setSortConfig((prevConfig) =>
            prevConfig && prevConfig.key === key
                ? {
                      ...prevConfig,
                      direction:
                          prevConfig.direction === "asc" ? "desc" : "asc",
                  }
                : { key, direction: "asc" },
        );
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof FeeDetail }) => {
        if (sortConfig?.key !== columnKey) return null;
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Fee Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Select onValueChange={(value) => setFilter(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BASIC">Basic</SelectItem>
                            <SelectItem value="STANDARD">Standard</SelectItem>
                            <SelectItem value="PREMIUM">Premium</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("name")}
                                    >
                                        Name <SortIcon columnKey="name" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            handleSort("totalAmountPaid")
                                        }
                                    >
                                        Total Paid{" "}
                                        <SortIcon columnKey="totalAmountPaid" />
                                    </Button>
                                </TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payments</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFeeDetails.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell className="font-medium">
                                        {detail.name}
                                    </TableCell>
                                    <TableCell>
                                        ${detail.totalAmountPaid}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {detail.Fees?.mentorshipPlan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {detail.Fees?.allClear ? (
                                            <Badge variant="default">
                                                All Clear
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Pending
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <details className="cursor-pointer">
                                            <summary>View Payments</summary>
                                            <ul className="mt-2 space-y-1 text-sm">
                                                {detail.Fees?.payments.map(
                                                    (payment, index) => (
                                                        <li key={index}>
                                                            {new Date(
                                                                payment.date,
                                                            ).toLocaleDateString()}
                                                            : ${payment.amount}(
                                                            {payment.mode ||
                                                                "N/A"}
                                                            )
                                                            {payment.cleared ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-2"
                                                                >
                                                                    Cleared
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-2"
                                                                >
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </details>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
