import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fetchSupervisorDetails = async (
    username: string,
): Promise<{
    id: string;
    name: string;
    username: string;
    SeniorMentor: {
        id: string;
        name: string;
        username: string;
    }[];
}> => {
    const { data } = await axios.post(
        "/api/supervisorDetail",
        {
            supervisorUsername: username,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

const SupervisorDetailMain = () => {
    const [supervisorDetails, setSupervisorDetails] = useState<{
        id: string;
        name: string;
        username: string;
        SeniorMentor: {
            id: string;
            name: string;
            username: string;
        }[];
    }>();
    let { username } = useParams();

    useEffect(() => {
        if (!username) return;
        fetchSupervisorDetails(username).then((data) => {
            setSupervisorDetails(data);
        });
    }, [username]);

    return (
        <>
            {supervisorDetails && (
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">
                        {supervisorDetails.name}
                    </h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Senior Mentors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {supervisorDetails.SeniorMentor.map(
                                (mentor: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center mb-2"
                                    >
                                        <User className="mr-2" />
                                        <span>
                                            {mentor.name} ({mentor.username})
                                        </span>
                                    </div>
                                ),
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default SupervisorDetailMain;
