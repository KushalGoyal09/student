import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Payment = {
    id: string;
    amount: number;
    date: string;
    mode: string | null;
    cleared: boolean;
};

type EditPaymentDialogProps = {
    payment: Payment | null;
    onClose: () => void;
    onSave: (updatedPayment: Partial<Payment>) => void;
};

export function EditPaymentDialog({
    payment,
    onClose,
    onSave,
}: EditPaymentDialogProps) {
    const [editedPayment, setEditedPayment] = useState<Partial<Payment>>({});

    useEffect(() => {
        if (payment) {
            setEditedPayment(payment);
        }
    }, [payment]);

    if (!payment) return null;

    return (
        <Dialog open={!!payment} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={editedPayment.amount}
                            onChange={(e) =>
                                setEditedPayment({
                                    ...editedPayment,
                                    amount: parseInt(e.target.value),
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={editedPayment.date}
                            onChange={(e) =>
                                setEditedPayment({
                                    ...editedPayment,
                                    date: e.target.value,
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mode" className="text-right">
                            Mode
                        </Label>
                        <Input
                            id="mode"
                            value={editedPayment.mode || ""}
                            onChange={(e) =>
                                setEditedPayment({
                                    ...editedPayment,
                                    mode: e.target.value,
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cleared" className="text-right">
                            Cleared
                        </Label>
                        <Switch
                            id="cleared"
                            checked={editedPayment.cleared}
                            onCheckedChange={(checked) =>
                                setEditedPayment({
                                    ...editedPayment,
                                    cleared: checked,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onSave(editedPayment)}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
