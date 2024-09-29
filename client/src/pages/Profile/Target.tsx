import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, Copy, Send, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRecoilValue } from "recoil";
import { Role, userAtom } from "@/recoil/userAtom";

type Subject = {
    chapterId: string;
    fromDate: string;
    toDate: string;
    lecturePerDay: number;
};

interface Chapter {
    id: number;
    chapterName: string;
    createdAt: Date;
}

interface Syllabus {
    physics: Chapter[];
    chemistry: Chapter[];
    biology: Chapter[];
}

type Target = {
    targetId: string;
    completed: boolean;
    studentId: string;
    physics: Subject;
    chemistry: Subject;
    biology: Subject;
};

type Props = {
    student: {
        id: string;
        name: string;
        whattsapNumber: string;
    };
};

export default function TargetComponent({ student }: Props) {
    const [targets, setTargets] = useState<Target[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingTarget, setIsAddingTarget] = useState(false);
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
    const [newTarget, setNewTarget] = useState<
        Omit<Target, "targetId" | "completed" | "studentId">
    >({
        physics: { chapterId: "", fromDate: "", toDate: "", lecturePerDay: 0 },
        chemistry: {
            chapterId: "",
            fromDate: "",
            toDate: "",
            lecturePerDay: 0,
        },
        biology: { chapterId: "", fromDate: "", toDate: "", lecturePerDay: 0 },
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const role = useRecoilValue(userAtom);

    useEffect(() => {
        fetchTargets();
        fetchSyllabus();
    }, [student.id]);

    const fetchTargets = async () => {
        setIsLoading(true);
        try {
            const uncompletedResponse = await fetch("/api/target/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    studentId: student.id,
                    completed: false,
                }),
            });
            const completedResponse = await fetch("/api/target/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    studentId: student.id,
                    completed: true,
                }),
            });
            if (!uncompletedResponse.ok || !completedResponse.ok)
                throw new Error("Failed to fetch targets");
            const uncompletedData = await uncompletedResponse.json();
            const completedData = await completedResponse.json();
            setTargets([...uncompletedData.data, ...completedData.data]);
        } catch (error) {
            console.error("Error fetching targets:", error);
            toast({
                title: "Error",
                description: "Failed to load targets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSyllabus = async () => {
        try {
            const response = await fetch("/api/syllabus/getAll", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch syllabus");
            const data = await response.json();
            setSyllabus(data);
        } catch (error) {
            console.error("Error fetching syllabus:", error);
            toast({
                title: "Error",
                description: "Failed to fetch syllabus",
                variant: "destructive",
            });
        }
    };

    const handleMarkComplete = async (targetId: string) => {
        try {
            const response = await fetch("/api/target/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ targetId }),
            });
            if (response.ok) {
                setTargets((prevTargets) =>
                    prevTargets.map((target) =>
                        target.targetId === targetId
                            ? { ...target, completed: !target.completed }
                            : target,
                    ),
                );
                toast({
                    title: "Success",
                    description: "Target status updated",
                });
            } else {
                throw new Error("Failed to update target status");
            }
        } catch (error) {
            console.error("Error updating target status:", error);
            toast({
                title: "Error",
                description: "Failed to update target status",
                variant: "destructive",
            });
        }
    };

    const handleAddTarget = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingTarget(true);
        try {
            const response = await fetch("/api/target/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...newTarget,
                    studentId: student.id,
                }),
            });
            if (response.ok) {
                await fetchTargets();
                setNewTarget({
                    physics: {
                        chapterId: "",
                        fromDate: "",
                        toDate: "",
                        lecturePerDay: 0,
                    },
                    chemistry: {
                        chapterId: "",
                        fromDate: "",
                        toDate: "",
                        lecturePerDay: 0,
                    },
                    biology: {
                        chapterId: "",
                        fromDate: "",
                        toDate: "",
                        lecturePerDay: 0,
                    },
                });
                setIsDialogOpen(false);
                toast({ title: "Success", description: "New target added" });
            } else {
                throw new Error("Failed to add new target");
            }
        } catch (error) {
            console.error("Error adding new target:", error);
            toast({
                title: "Error",
                description: "Failed to add new target",
                variant: "destructive",
            });
        } finally {
            setIsAddingTarget(false);
        }
    };

    const copyToClipboard = (target: Target) => {
        const message =
            `Physics: ${target.physics.chapterId}, ${target.physics.lecturePerDay} lectures per day, from ${target.physics.fromDate} to ${target.physics.toDate}\n` +
            `Chemistry: ${target.chemistry.chapterId}, ${target.chemistry.lecturePerDay} lectures per day, from ${target.chemistry.fromDate} to ${target.chemistry.toDate}\n` +
            `Biology: ${target.biology.chapterId}, ${target.biology.lecturePerDay} lectures per day, from ${target.biology.fromDate} to ${target.biology.toDate}`;
        navigator.clipboard.writeText(message);
        toast({
            title: "Copied",
            description: "Target details copied to clipboard",
        });
    };

    const shareViaWhatsApp = (target: Target) => {
        let message =
            `Physics: ${target.physics.chapterId}, ${target.physics.lecturePerDay} lectures per day, from ${target.physics.fromDate} to ${target.physics.toDate}\n` +
            `Chemistry: ${target.chemistry.chapterId}, ${target.chemistry.lecturePerDay} lectures per day, from ${target.chemistry.fromDate} to ${target.chemistry.toDate}\n` +
            `Biology: ${target.biology.chapterId}, ${target.biology.lecturePerDay} lectures per day, from ${target.biology.fromDate} to ${target.biology.toDate}`;
        message = `Hello ${student.name},\n\nHere is your target:\n\n${message}\n.`;
        let whattsapNumber = student.whattsapNumber;
        if (!whattsapNumber.startsWith("+")) {
            whattsapNumber = `+91${whattsapNumber}`;
        }
        const whatsappUrl = `https://wa.me/${whattsapNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const renderTargetCard = (target: Target) => (
        <Card key={target.targetId} className="mb-4">
            <CardContent className="pt-6">
                {["physics", "chemistry", "biology"].map((subject) => (
                    <div key={subject} className="mb-4">
                        <h4 className="font-semibold capitalize">{subject}</h4>
                        <p>
                            Chapter:{" "}
                            {(target[subject as keyof Target] as any).chapterId}
                        </p>
                        <p>
                            From:{" "}
                            {new Date(
                                (
                                    target[subject as keyof Target] as any
                                ).fromDate,
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            To:{" "}
                            {new Date(
                                (target[subject as keyof Target] as any).toDate,
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            Lectures per day:{" "}
                            {
                                (target[subject as keyof Target] as any)
                                    .lecturePerDay
                            }
                        </p>
                    </div>
                ))}
                <div className="flex flex-wrap justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(target)}
                    >
                        <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareViaWhatsApp(target)}
                    >
                        <Send className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleMarkComplete(target.targetId)}
                    >
                        <Check className="h-4 w-4 mr-2" />{" "}
                        {target.completed ? "Uncomplete" : "Complete"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <Card className="w-full mt-6">
                <CardContent className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full mt-6 max-w-6xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Targets</CardTitle>
                {(role === Role.groupMentor ||
                    role === Role.admin ||
                    role === Role.seniorMentor ||
                    role === Role.supervisor) && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Add Target
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Target</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddTarget}
                                className="space-y-4"
                            >
                                {["physics", "chemistry", "biology"].map(
                                    (subject) => (
                                        <div
                                            key={subject}
                                            className="space-y-2"
                                        >
                                            <Label
                                                htmlFor={`${subject}-chapter`}
                                                className="capitalize"
                                            >
                                                {subject}
                                            </Label>
                                            <Select
                                                value={
                                                    newTarget[
                                                        subject as keyof typeof newTarget
                                                    ].chapterId
                                                }
                                                onValueChange={(value) =>
                                                    setNewTarget({
                                                        ...newTarget,
                                                        [subject]: {
                                                            ...newTarget[
                                                                subject as keyof typeof newTarget
                                                            ],
                                                            chapterId: value,
                                                        },
                                                    })
                                                }
                                            >
                                                <SelectTrigger
                                                    id={`${subject}-chapter`}
                                                >
                                                    <SelectValue placeholder="Select chapter" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {syllabus &&
                                                        syllabus[
                                                            subject as keyof typeof syllabus
                                                        ].map((chapter) => (
                                                            <SelectItem
                                                                key={chapter.id}
                                                                value={chapter.id.toString()}
                                                            >
                                                                {
                                                                    chapter.chapterName
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="date"
                                                    placeholder="From Date"
                                                    value={
                                                        newTarget[
                                                            subject as keyof typeof newTarget
                                                        ].fromDate
                                                    }
                                                    onChange={(e) =>
                                                        setNewTarget({
                                                            ...newTarget,
                                                            [subject]: {
                                                                ...newTarget[
                                                                    subject as keyof typeof newTarget
                                                                ],
                                                                fromDate:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="To Date"
                                                    value={
                                                        newTarget[
                                                            subject as keyof typeof newTarget
                                                        ].toDate
                                                    }
                                                    onChange={(e) =>
                                                        setNewTarget({
                                                            ...newTarget,
                                                            [subject]: {
                                                                ...newTarget[
                                                                    subject as keyof typeof newTarget
                                                                ],
                                                                toDate: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="Lectures per day"
                                                value={
                                                    newTarget[
                                                        subject as keyof typeof newTarget
                                                    ].lecturePerDay
                                                }
                                                onChange={(e) =>
                                                    setNewTarget({
                                                        ...newTarget,
                                                        [subject]: {
                                                            ...newTarget[
                                                                subject as keyof typeof newTarget
                                                            ],
                                                            lecturePerDay:
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    ),
                                )}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isAddingTarget}
                                >
                                    {isAddingTarget
                                        ? "Adding..."
                                        : "Add Target"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="uncompleted" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="uncompleted">
                            Uncompleted
                        </TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="uncompleted">
                        {targets
                            .filter((t) => !t.completed)
                            .map(renderTargetCard)}
                    </TabsContent>
                    <TabsContent value="completed">
                        {targets
                            .filter((t) => t.completed)
                            .map(renderTargetCard)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
