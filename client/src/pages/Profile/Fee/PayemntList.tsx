import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EditPaymentDialog } from "./EditPaymentDialog";

type Payment = {
    id: string;
    amount: number;
    date: string;
    mode: string | null;
    cleared: boolean;
};

type PaymentListProps = {
    payments: Payment[];
    onEditPayment: (
        paymentId: string,
        updatedPayment: Partial<Payment>,
    ) => void;
};

export function PaymentList({ payments, onEditPayment }: PaymentListProps) {
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

    const getDueDays = (payment: Payment) => {
        if (payment.cleared) return 0;
        const dueDate = new Date(payment.date);
        const today = new Date();
        const diffTime = -(today.getTime() - dueDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Cleared</TableHead>
                        <TableHead>Due Days</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow
                            key={payment.id}
                            className={
                                (payment.cleared && "bg-green-400") || ""
                            }
                        >
                            <TableCell>₹{payment.amount}</TableCell>
                            <TableCell>
                                {new Date(payment.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{payment.mode || "N/A"}</TableCell>
                            <TableCell>
                                {payment.cleared ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>{getDueDays(payment)}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingPayment(payment)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditPaymentDialog
                payment={editingPayment}
                onClose={() => setEditingPayment(null)}
                onSave={(updatedPayment) => {
                    if (editingPayment) {
                        onEditPayment(editingPayment.id, updatedPayment);
                        setEditingPayment(null);
                    }
                }}
            />
        </div>
    );
}
