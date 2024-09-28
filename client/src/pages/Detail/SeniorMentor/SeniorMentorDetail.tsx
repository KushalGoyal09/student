import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useNavigate, Outlet } from "react-router-dom";

const fetchSeniorMentors = async () => {
    try {
        const { data } = await axios.get("/api/detail/senior-mentors", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return data.data;
    } catch (error) {
        toast({
            description: "Something went wrong",
        });
    }
};

export default function SupervisorDetails() {
    const [sm, setSm] = useState<
        { id: number; name: string; username: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchSeniorMentors().then((data) => {
            setSm(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUsername = event.target.value;
        setSelectedMentor(selectedUsername);
        if (selectedUsername) {
            navigate(`/seniorMentor/${selectedUsername}`);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background p-4">
            <header className="w-full mb-4">
                <label
                    htmlFor="mentor-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Select a Senior Mentor
                </label>
                <div className="relative">
                    <select
                        id="mentor-select"
                        value={selectedMentor}
                        onChange={handleChange}
                        className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        disabled={loading || !sm.length}
                    >
                        <option value="" disabled>
                            {loading
                                ? "Loading Senior Mentors..."
                                : "Choose a Senior Mentor"}
                        </option>
                        {sm.map((supervisor) => (
                            <option
                                key={supervisor.id}
                                value={supervisor.username}
                            >
                                {supervisor.name}
                            </option>
                        ))}
                    </select>
                    {loading && !sm.length && (
                        <div className="absolute inset-0 bg-white opacity-50 flex items-center justify-center">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
