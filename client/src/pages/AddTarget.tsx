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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Check, Copy, Send } from "lucide-react";

interface Student {
    id: string;
    name: string;
    whattsapNumber: string;
}

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

interface SubjectTarget {
    chapter: string;
    fromDate: string;
    toDate: string;
    lecturePerDay: number;
}

interface Target {
    targetId: string;
    completed: boolean;
    studentId: string;
    physics: SubjectTarget;
    chemistry: SubjectTarget;
    biology: SubjectTarget;
}

interface NewTarget {
    studentId: string;
    physics: {
        chapterId: number;
        fromDate: string;
        toDate: string;
        lecturePerDay: number;
    };
    chemistry: {
        chapterId: number;
        fromDate: string;
        toDate: string;
        lecturePerDay: number;
    };
    biology: {
        chapterId: number;
        fromDate: string;
        toDate: string;
        lecturePerDay: number;
    };
}

export default function EnhancedStudentTargetAllocation() {
    const [students, setStudents] = useState<Student[]>([]);
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
    const [targets, setTargets] = useState<Target[]>([]);
    const [newTarget, setNewTarget] = useState<NewTarget | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchSyllabus();
        fetchTargets();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch("/api/detail/students", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setStudents(data.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to fetch students",
                variant: "destructive",
            });
        }
    };

    const fetchSyllabus = async () => {
        try {
            const response = await fetch("/api/syllabus/getAll", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
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

    const fetchTargets = async () => {
        try {
            const response = await fetch("/api/target/get", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setTargets(data.data);
        } catch (error) {
            console.error("Error fetching targets:", error);
            toast({
                title: "Error",
                description: "Failed to fetch targets",
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
                            ? { ...target, completed: true }
                            : target,
                    ),
                );
                toast({
                    title: "Success",
                    description: "Target marked as complete",
                });
            } else {
                throw new Error("Failed to mark target as complete");
            }
        } catch (error) {
            console.error("Error marking target as complete:", error);
            toast({
                title: "Error",
                description: "Failed to mark target as complete",
                variant: "destructive",
            });
        }
    };

    const handleAddTarget = async (studentId: string) => {
        if (!newTarget) return;

        try {
            const response = await fetch("/api/target/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...newTarget,
                    studentId,
                }),
            });
            if (response.ok) {
                fetchTargets();
                setNewTarget(null);
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
        }
    };

    const sendTargetToWhatsApp = (student: Student, target: Target) => {
        let message =
            `Physics: ${target.physics.chapter}, ${target.physics.lecturePerDay} lectures per day, from ${target.physics.fromDate} to ${target.physics.toDate}\n` +
            `Chemistry: ${target.chemistry.chapter}, ${target.chemistry.lecturePerDay} lectures per day, from ${target.chemistry.fromDate} to ${target.chemistry.toDate}\n` +
            `Biology: ${target.biology.chapter}, ${target.biology.lecturePerDay} lectures per day, from ${target.biology.fromDate} to ${target.biology.toDate}`;
        message = `Hello ${student.name},\n\nHere is your target:\n\n${message}\n.`;
        let whattsapNumber = student.whattsapNumber;
        if (!whattsapNumber.startsWith("+")) {
            whattsapNumber = `+91${whattsapNumber}`;
        }
        const whatsappUrl = `https://wa.me/${whattsapNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const copyTargetToClipboard = (target: Target) => {
        const message =
            `Physics: ${target.physics.chapter}, ${target.physics.lecturePerDay} lectures per day, from ${target.physics.fromDate} to ${target.physics.toDate}\n` +
            `Chemistry: ${target.chemistry.chapter}, ${target.chemistry.lecturePerDay} lectures per day, from ${target.chemistry.fromDate} to ${target.chemistry.toDate}\n` +
            `Biology: ${target.biology.chapter}, ${target.biology.lecturePerDay} lectures per day, from ${target.biology.fromDate} to ${target.biology.toDate}`;
        navigator.clipboard.writeText(message);
        toast({
            title: "Copied",
            description: "Target details copied to clipboard",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Student Target Allocation
            </h1>
            <Accordion type="single" collapsible className="w-full">
                {students.map((student) => (
                    <AccordionItem key={student.id} value={student.id}>
                        <AccordionTrigger>{student.name}</AccordionTrigger>
                        <AccordionContent>
                            <Card className="mb-4">
                                <CardHeader>
                                    <CardTitle>{student.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {targets
                                            .filter(
                                                (target) =>
                                                    target.studentId ===
                                                        student.id &&
                                                    !target.completed,
                                            )
                                            .map((target) => (
                                                <Card
                                                    key={target.targetId}
                                                    className="p-4"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-semibold">
                                                            Target
                                                        </h3>
                                                        <div className="space-x-2">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    copyTargetToClipboard(
                                                                        target,
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    sendTargetToWhatsApp(
                                                                        student,
                                                                        target,
                                                                    )
                                                                }
                                                            >
                                                                <Send className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleMarkComplete(
                                                                        target.targetId,
                                                                    )
                                                                }
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {[
                                                        "physics",
                                                        "chemistry",
                                                        "biology",
                                                    ].map((subject) => (
                                                        <div
                                                            key={subject}
                                                            className="mb-2"
                                                        >
                                                            <p>
                                                                <strong>
                                                                    {subject
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase() +
                                                                        subject.slice(
                                                                            1,
                                                                        )}
                                                                    :
                                                                </strong>{" "}
                                                                {
                                                                    (
                                                                        target[
                                                                            subject as keyof Target
                                                                        ] as any
                                                                    ).chapter
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    (
                                                                        target[
                                                                            subject as keyof Target
                                                                        ] as any
                                                                    )
                                                                        .lecturePerDay
                                                                }{" "}
                                                                lectures per
                                                                day, from{" "}
                                                                {
                                                                    (
                                                                        target[
                                                                            subject as keyof Target
                                                                        ] as any
                                                                    ).fromDate
                                                                }{" "}
                                                                to{" "}
                                                                {
                                                                    (
                                                                        target[
                                                                            subject as keyof Target
                                                                        ] as any
                                                                    ).toDate
                                                                }
                                                            </p>
                                                        </div>
                                                    ))}
                                                </Card>
                                            ))}
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <Link to={`/profile/${student.id}`}>
                                            <Button variant="outline">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Dialog
                                            open={isDialogOpen}
                                            onOpenChange={setIsDialogOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button>Add New Target</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Add New Target
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    {[
                                                        "physics",
                                                        "chemistry",
                                                        "biology",
                                                    ].map((subject) => (
                                                        <div
                                                            key={subject}
                                                            className="grid gap-2"
                                                        >
                                                            <Label
                                                                htmlFor={`${subject}-chapter`}
                                                            >
                                                                {subject
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    subject.slice(
                                                                        1,
                                                                    )}{" "}
                                                                Chapter
                                                            </Label>
                                                            <Select
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    setNewTarget(
                                                                        //@ts-ignore
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [subject]:
                                                                                {
                                                                                    //@ts-ignore
                                                                                    ...prev?.[
                                                                                        subject as keyof NewTarget
                                                                                    ],
                                                                                    chapterId:
                                                                                        Number(
                                                                                            value,
                                                                                        ),
                                                                                },
                                                                        }),
                                                                    )
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
                                                                            subject as keyof Syllabus
                                                                        ].map(
                                                                            (
                                                                                chapter,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        chapter.id
                                                                                    }
                                                                                    value={chapter.id.toString()}
                                                                                >
                                                                                    {
                                                                                        chapter.chapterName
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`${subject}-from`}
                                                                    >
                                                                        From
                                                                        Date
                                                                    </Label>
                                                                    <Input
                                                                        id={`${subject}-from`}
                                                                        type="date"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setNewTarget(
                                                                                //@ts-ignore
                                                                                (
                                                                                    prev,
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    [subject]:
                                                                                        {
                                                                                            //@ts-ignore
                                                                                            ...prev?.[
                                                                                                subject as keyof NewTarget
                                                                                            ],
                                                                                            fromDate:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        },
                                                                                }),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`${subject}-to`}
                                                                    >
                                                                        To Date
                                                                    </Label>
                                                                    <Input
                                                                        id={`${subject}-to`}
                                                                        type="date"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setNewTarget(
                                                                                //@ts-ignore
                                                                                (
                                                                                    prev,
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    [subject]:
                                                                                        {
                                                                                            //@ts-ignore
                                                                                            ...prev?.[
                                                                                                subject as keyof NewTarget
                                                                                            ],
                                                                                            toDate: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                }),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label
                                                                    htmlFor={`${subject}-lectures`}
                                                                >
                                                                    Lectures Per
                                                                    Day
                                                                </Label>
                                                                <Input
                                                                    id={`${subject}-lectures`}
                                                                    type="number"
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setNewTarget(
                                                                            //@ts-ignore
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                [subject]:
                                                                                    {
                                                                                        //@ts-ignore
                                                                                        ...prev?.[
                                                                                            subject as keyof NewTarget
                                                                                        ],
                                                                                        lecturePerDay:
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            ),
                                                                                    },
                                                                            }),
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setNewTarget(
                                                            //@ts-ignore
                                                            (prev) => ({
                                                                ...prev,
                                                                studentId:
                                                                    student.id,
                                                            }),
                                                        );
                                                        handleAddTarget(
                                                            student.id,
                                                        );
                                                    }}
                                                >
                                                    Add Target
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
