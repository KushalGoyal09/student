import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";

type Mentor = {
    id: string;
    name: string;
    username: string;
};

type Props = {
    studentId: string;
    currentMentor?: { name: string; username: string };
};

const AssignMentor = ({ studentId, currentMentor }: Props) => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<string>("");
    const [groupLink, setGroupLink] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMentors = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get("/api/detail/mentors", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setMentors(data.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load mentors. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentors();
    }, [toast]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedMentor) {
            toast({
                title: "Error",
                description: "Please select a mentor before submitting.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        try {
            await axios.post(
                "/api/new/assign-mentor",
                {
                    studentId,
                    mentorId: selectedMentor,
                    whattsapGroupLink: groupLink,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            toast({
                title: "Success",
                description: "Mentor assigned successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign mentor. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full mt-6 max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Assign Mentor
                </CardTitle>
            </CardHeader>
            <CardContent>
                {currentMentor && (
                    <div className="mb-4 p-4 bg-yellow-100 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-sm text-yellow-700">
                            Current mentor: {currentMentor.name} (
                            {currentMentor.username})
                        </p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="mentor-select"
                            className="text-sm font-medium text-gray-700"
                        >
                            Select Mentor
                        </label>
                        <Select
                            onValueChange={setSelectedMentor}
                            value={selectedMentor}
                        >
                            <SelectTrigger
                                id="mentor-select"
                                className="w-full"
                            >
                                <SelectValue placeholder="Select a mentor" />
                            </SelectTrigger>
                            <SelectContent>
                                {mentors.map((mentor) => (
                                    <SelectItem
                                        key={mentor.id}
                                        value={mentor.id}
                                    >
                                        {mentor.name} ({mentor.username})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <label
                            htmlFor="groupLink"
                            className="text-sm font-medium text-gray-700"
                        >
                            Whattsap Group Link
                        </label>
                        <Input
                            value={groupLink}
                            onChange={(e) => setGroupLink(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Assigning..." : "Assign Mentor"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AssignMentor;
