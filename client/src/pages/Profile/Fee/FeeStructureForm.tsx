import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const defaultFeeStructure = {
    Elite: { 1: [12990], 2: [7500, 7500], 3: [5500, 5500, 3990] },
    Pro: { 1: [13999], 2: [7500, 7500], 3: [5500, 5500, 5000] },
    Max: { 1: [24999], 2: [15000, 15000] },
};


type FeeStructureFormProps = {
  onSubmit: (mentorshipPlan: MentorshipPlan, feePlan: number, payments: Payment[]) => void
  initialData?: FeeData
}

export function FeeStructureForm({ onSubmit, initialData }: FeeStructureFormProps) {
  const [mentorshipPlan, setMentorshipPlan] = useState<MentorshipPlan>(initialData?.mentorshipPlan || 'Elite')
  const [feePlan, setFeePlan] = useState<number>(initialData?.feesPlan || 1)
  const [payments, setPayments] = useState<Payment[]>(initialData?.payments || [])

  useEffect(() => {
    if (!initialData) {
      //@ts-ignore
      const defaultPayments = defaultFeeStructure[mentorshipPlan][feePlan].map((amount, index) => ({
        id: `payment-${index + 1}`,
        amount,
        date: new Date(Date.now() + index * 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mode: null,
        cleared: false,
      }))
      setPayments(defaultPayments)
    }
  }, [mentorshipPlan, feePlan, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(mentorshipPlan, feePlan, payments)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Mentorship Plan</Label>
        <RadioGroup
          value={mentorshipPlan}
          onValueChange={(value: MentorshipPlan) => setMentorshipPlan(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Elite" id="elite" />
            <Label htmlFor="elite">Elite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Pro" id="pro" />
            <Label htmlFor="pro">Pro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Max" id="max" />
            <Label htmlFor="max">Max</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="fee-plan">Fee Plan (Installments)</Label>
        <Select
          value={feePlan.toString()}
          onValueChange={(value) => setFeePlan(parseInt(value))}
        >
          <SelectTrigger id="fee-plan">
            <SelectValue placeholder="Select fee plan" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(defaultFeeStructure[mentorshipPlan]).map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan} installment(s)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Payments</Label>
        {payments.map((payment, index) => (
          <div key={payment.id} className="flex space-x-2">
            <Input
              type="number"
              value={payment.amount}
              onChange={(e) => {
                const newPayments = [...payments]
                newPayments[index].amount = parseInt(e.target.value)
                setPayments(newPayments)
              }}
              placeholder="Amount"
            />
            <Input
              type="date"
              value={payment.date}
              onChange={(e) => {
                const newPayments = [...payments]
                newPayments[index].date = e.target.value
                setPayments(newPayments)
              }}
            />
          </div>
        ))}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}