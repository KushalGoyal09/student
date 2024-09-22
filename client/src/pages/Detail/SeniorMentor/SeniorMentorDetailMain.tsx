import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const fetchSMDetails = async (
    username: string,
): Promise<{
    id: string;
    name: string;
    username: string;
    GroupMentor: {
        id: string;
        name: string;
        username: string;
    }[];
}> => {
    const { data } = await axios.post(
        "/api/detail/senior-mentor-detail",
        {
            seniorMentorUsername: username,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return data.data;
};

const SMDetailsMain = () => {
    const [supervisorDetails, setSupervisorDetails] = useState<{
        id: string;
        name: string;
        username: string;
        GroupMentor: {
            id: string;
            name: string;
            username: string;
        }[];
    }>();
    let { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) return;
        fetchSMDetails(username).then((data) => {
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
                            <CardTitle>Group Mentors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {supervisorDetails.GroupMentor.map(
                                (mentor: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center mb-2"
                                        onClick={() =>
                                            navigate(
                                                `/mentor/${mentor.username}`,
                                            )
                                        }
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

export default SMDetailsMain;
