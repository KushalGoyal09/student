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
    rating: number;
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
        rating: number;
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
                    <h1 className="text-3xl font-bold text-gray-800">
                        {supervisorDetails.name}
                    </h1>
                    <div className="flex justify-between items-center mt-2 p-4 bg-gray-100 rounded-lg shadow-md">
                        <span className="text-lg font-medium text-gray-600">
                            <span className="text-gray-500">Username:</span>{" "}
                            {supervisorDetails.username}
                        </span>
                        <span className="text-lg font-medium text-gray-600">
                            <span className="text-yellow-500">⭐</span>{" "}
                            {supervisorDetails.rating}
                        </span>
                    </div>

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
