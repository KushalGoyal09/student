import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Outlet, useNavigate } from "react-router-dom";

const fetchSupervisors = async () => {
    try {
        const { data } = await axios.get("/api/detail/supervisors", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(data);
        return data.data;
    } catch (error) {
        toast({
            description: "Something went wrong",
        });
    }
};

export default function SupervisorDetails() {
    const [supervisors, setSupervisors] = useState<
        { id: number; name: string; username: string }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupervisors().then((data) => {
            setSupervisors(data);
            setLoading(false);
        });
    }, []);

    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background">
            <aside className="w-full md:w-64 p-4 border-r">
                <h2 className="text-xl font-bold mb-4">Supervisors</h2>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    {loading && !supervisors.length
                        ? Array(5)
                              .fill(0)
                              .map((_, i) => (
                                  <Skeleton
                                      key={i}
                                      className="h-10 w-full mb-2"
                                  />
                              ))
                        : supervisors.map((supervisor) => (
                              <button
                                  key={supervisor.id}
                                  className={`w-full text-left p-2 rounded mb-2`}
                                  onClick={() =>
                                      navigate(`/supervisor/${supervisor.username}`)
                                  }
                              >
                                  {supervisor.name}
                              </button>
                          ))}
                </ScrollArea>
            </aside>
            <main className="flex-1 p-4 overflow-auto">
                <Outlet/>
            </main>
        </div>
    );
}
