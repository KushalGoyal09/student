import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

interface Student {
    id: string;
    name: string;
    whattsapNumber: string;
    motherNumber: string;
    fatherNumber: string;
    previousScore: string;
    platform: string;
}

interface MentorData {
    id: string;
    name: string;
    username: string;
    Student: Student[];
}

const fetchMentorDetails = async (username: string): Promise<MentorData> => {
    const { data } = await axios.post(
        "/api/detail/mentor-detail",
        {
            groupMentorUsername: username,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

export default function Component() {
    let { username } = useParams();
    const [data, setData] = useState<MentorData>();

    useEffect(() => {
        if (!username) return;
        fetchMentorDetails(username).then((data) => {
            setData(data);
        });
    }, [username]);

    return (
        <>
            {data && (
                <div className="container mx-auto p-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mentor Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Name:</strong> {data.name}
                                </div>
                                <div>
                                    <strong>Username:</strong> {data.username}
                                </div>
                                <div>
                                    <strong>ID:</strong> {data.id}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>WhatsApp Number</TableHead>
                                        <TableHead>Mother's Number</TableHead>
                                        <TableHead>Father's Number</TableHead>
                                        <TableHead>Previous Score</TableHead>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.Student.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                {student.name}
                                            </TableCell>
                                            <TableCell>
                                                {student.whattsapNumber}
                                            </TableCell>
                                            <TableCell>
                                                {student.motherNumber}
                                            </TableCell>
                                            <TableCell>
                                                {student.fatherNumber}
                                            </TableCell>
                                            <TableCell>
                                                {student.previousScore}
                                            </TableCell>
                                            <TableCell>
                                                {student.platform}
                                            </TableCell>
                                            <TableCell>
                                                <Button asChild>
                                                    <Link
                                                        to={`/profile/${student.id}`}
                                                    >
                                                        View Profile
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
