import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Student {
    id: string;
    name: string;
    callNumber: string;
    kitDispatched: boolean;
    kitDispatchedDate: Date | null;
}

const KitDispatchPage = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchKitDispatchData = async () => {
            try {
                const { data } = await axios.get("/api/new/kit-data", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStudents(data.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch kit dispatch data",
                    variant: "destructive",
                });
            }
        };
        fetchKitDispatchData();
    }, []);

    const handleMarkDispatched = async (studentId: string) => {
        const date = new Date();
        try {
            await axios.post(
                "/api/new/kit-dispatch",
                {
                    studentId,
                    date,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === studentId
                        ? {
                              ...student,
                              kitDispatched: true,
                              kitDispatchedDate: date,
                          }
                        : student,
                ),
            );
            toast({
                title: "Success",
                description: "Kit marked as dispatched",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark kit dispatched",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Student Kit Dispatch</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                    <Card key={student.id} className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {student.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-1 text-sm">
                                <dt className="font-medium">Call Number:</dt>
                                <dd>{student.callNumber}</dd>
                                <dt className="font-medium">Kit Status:</dt>
                                <dd>
                                    <Badge
                                        variant={
                                            student.kitDispatched
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {student.kitDispatched
                                            ? "Dispatched"
                                            : "Pending"}
                                    </Badge>
                                </dd>
                                <dt className="font-medium">Dispatch Date:</dt>
                                <dd>
                                    {student.kitDispatchedDate
                                        ? format(
                                              new Date(
                                                  student.kitDispatchedDate,
                                              ),
                                              "PP",
                                          )
                                        : "-"}
                                </dd>
                            </dl>
                            <div className="mt-4 space-y-2">
                                <Link
                                    to={`/profile/${student.id}`}
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        View Profile
                                    </Button>
                                </Link>
                                {!student.kitDispatched && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                            handleMarkDispatched(student.id)
                                        }
                                    >
                                        Mark Dispatched
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
export default KitDispatchPage;
