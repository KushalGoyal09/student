import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Edit,
    User,
    Phone,
    Book,
    Target,
    Clock,
    School,
    Award,
    Monitor,
    FileText,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Role, userAtom } from "@/recoil/userAtom";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import AssignMentor from "./AssaignMentor";
import FeeDetails from "./FeeDetail";
import TargetComponent from "./Target";
import StudentCallUpdates from "./Call";

interface Student {
    id: string;
    name: string;
    gender: string;
    fatherName: string;
    motherName: string;
    whattsapNumber: string;
    callNumber: string;
    motherNumber: string;
    fatherNumber: string;
    language: string;
    target: string;
    StudyHours: number;
    class: string;
    status: boolean;
    dropperStatus: string;
    previousScore: string;
    platform: string;
    dateOfDeactive?: Date;
    expectation: string;
    createdAt: Date;
    groupMentor?: {
        name: string;
        username: string;
    };
}

export default function Info() {
    const [isEditing, setIsEditing] = useState(false);
    const [student, setStudent] = useState<Student | null>(null);
    const [editedStudent, setEditedStudent] = useState<Student | null>(null);
    const { id } = useParams();
    const role = useRecoilValue(userAtom);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const { data } = await axios.post(
                    "/api/profile/student",
                    { studentId: id },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                setStudent(data.student);
                setEditedStudent(data.student);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                });
                setStudent(null);
            }
        };
        fetchStudent();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedStudent) return;

        try {
            console.log(editedStudent);
            await axios.post("/api/profile/update/student", editedStudent, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast({
                title: "Success",
                description: "Student updated successfully",
            });
            setIsEditing(false);
            setStudent(editedStudent);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update student",
            });
        }
    };

    return (
        <>
            {student && (
                <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
                    <Card className="w-full max-w-6xl mx-auto">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle
                                className={`text-xl font-bold ${!student.status && "text-red-500"}`}
                            >
                                Student Profile
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Label
                                    htmlFor="active"
                                    className="flex items-center space-x-2"
                                >
                                    <span>Active</span>
                                    <Switch
                                        id="active"
                                        checked={student.status}
                                        onCheckedChange={(e) => {
                                            const status = e;
                                            axios
                                                .post(
                                                    "/api/profile/update/status",
                                                    {
                                                        studentId: student.id,
                                                        date: new Date(),
                                                        status,
                                                    },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${localStorage.getItem(
                                                                "token",
                                                            )}`,
                                                        },
                                                    },
                                                )
                                                .then(() => {
                                                    setStudent((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  status,
                                                                  dateOfDeactive:
                                                                      status ===
                                                                      false
                                                                          ? new Date()
                                                                          : undefined,
                                                              }
                                                            : null,
                                                    );
                                                    toast({
                                                        title: "Success",
                                                        description: `Active status updated to ${status}`,
                                                    });
                                                })
                                                .catch(() => {
                                                    toast({
                                                        title: "Error",
                                                        description:
                                                            "Failed to update active status",
                                                    });
                                                });
                                        }}
                                    />
                                </Label>
                            </div>
                            {role === Role.admin && (
                                <Dialog
                                    open={isEditing}
                                    onOpenChange={setIsEditing}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                                Edit student profile
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Edit Student Profile
                                            </DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <ScrollArea className="h-[60vh] pr-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {editedStudent &&
                                                        Object.entries(
                                                            editedStudent,
                                                        ).map(
                                                            ([key, value]) => {
                                                                if (
                                                                    key !==
                                                                        "id" &&
                                                                    key !==
                                                                        "createdAt" &&
                                                                    key !==
                                                                        "groupMentor" &&
                                                                    key !==
                                                                        "expectation" &&
                                                                    key !==
                                                                        "dateOfDeactive" &&
                                                                    key !==
                                                                        "status"
                                                                ) {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                key
                                                                            }
                                                                            className="grid gap-2 py-2"
                                                                        >
                                                                            <Label
                                                                                htmlFor={
                                                                                    key
                                                                                }
                                                                            >
                                                                                {
                                                                                    key
                                                                                }
                                                                            </Label>
                                                                            <Input
                                                                                id={
                                                                                    key
                                                                                }
                                                                                name={
                                                                                    key
                                                                                }
                                                                                value={
                                                                                    value as string
                                                                                }
                                                                                onChange={
                                                                                    handleInputChange
                                                                                }
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            },
                                                        )}
                                                </div>
                                            </ScrollArea>
                                            <Button
                                                type="submit"
                                                className="mt-4"
                                            >
                                                Save Changes
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            {student.dateOfDeactive && (
                                <div className="bg-red-100 border border-red-200 text-red-900 p-2 rounded-md mb-4">
                                    <p>
                                        This student was deactivated on{" "}
                                        {new Date(
                                            student.dateOfDeactive,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-10">
                                    <TabsTrigger value="personal">
                                        Personal Info
                                    </TabsTrigger>
                                    <TabsTrigger value="contact">
                                        Contact Info
                                    </TabsTrigger>
                                    <TabsTrigger value="academic">
                                        Academic Info
                                    </TabsTrigger>
                                    <TabsTrigger value="other">
                                        Other Info
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="mt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={User}
                                            label="Name"
                                            value={student.name}
                                        />
                                        <InfoCard
                                            icon={User}
                                            label="Gender"
                                            value={student.gender}
                                        />
                                        <InfoCard
                                            icon={User}
                                            label="Father's Name"
                                            value={student.fatherName}
                                        />
                                        <InfoCard
                                            icon={User}
                                            label="Mother's Name"
                                            value={student.motherName}
                                        />
                                        <InfoCard
                                            icon={Book}
                                            label="Language"
                                            value={student.language}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="mt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={Phone}
                                            label="WhatsApp Number"
                                            value={student.whattsapNumber}
                                        />
                                        <InfoCard
                                            icon={Phone}
                                            label="Call Number"
                                            value={student.callNumber}
                                        />
                                        <InfoCard
                                            icon={Phone}
                                            label="Mother's Number"
                                            value={student.motherNumber}
                                        />
                                        <InfoCard
                                            icon={Phone}
                                            label="Father's Number"
                                            value={student.fatherNumber}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="academic" className="mt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={Target}
                                            label="Target"
                                            value={student.target}
                                        />
                                        <InfoCard
                                            icon={Clock}
                                            label="Study Hours"
                                            value={student.StudyHours.toString()}
                                        />
                                        <InfoCard
                                            icon={School}
                                            label="Class"
                                            value={student.class}
                                        />
                                        <InfoCard
                                            icon={Award}
                                            label="Previous Score"
                                            value={student.previousScore}
                                        />
                                        <InfoCard
                                            icon={Monitor}
                                            label="Platform"
                                            value={student.platform}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="other" className="mt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={FileText}
                                            label="Dropper Status"
                                            value={student.dropperStatus}
                                        />
                                        <InfoCard
                                            icon={FileText}
                                            label="Expectation"
                                            value={student.expectation}
                                        />
                                        <InfoCard
                                            icon={Clock}
                                            label="Created At"
                                            value={new Date(
                                                student.createdAt,
                                            ).toLocaleDateString()}
                                        />
                                        {student.groupMentor && (
                                            <InfoCard
                                                icon={User}
                                                label="Group Mentor"
                                                value={`${student.groupMentor.name} (${student.groupMentor.username})`}
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                    {role === Role.admin && !student.groupMentor && (
                        <AssignMentor
                            studentId={student.id}
                            currentMentor={student.groupMentor}
                        />
                    )}
                    {role === Role.admin && (
                        <FeeDetails studentId={student.id} />
                    )}
                    <TargetComponent student={student} />
                    <StudentCallUpdates studentId={student.id} />
                </div>
            )}
        </>
    );
}

function InfoCard({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
