import Loading from "@/components/Loading";
import { useState } from "react";
import { Suspense, lazy } from "react";
const NeetSyallabus = lazy(() => import("./NeetSyallabus"));
const OverallSyallabus = lazy(() => import("./OverallSyallabus"));

export default function Syallabus() {
    const [tab, setTab] = useState<"Neet" | "overall">("overall");

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        tab === "overall"
                            ? "bg-pcb text-white"
                            : "bg-pcb/25 text-pcb"
                    }`}
                    onClick={() => setTab("overall")}
                >
                    OVERALL BATCH
                </button>
                <button
                    className={`ml-4 px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        tab === "Neet"
                            ? "bg-pcb text-white"
                            : "bg-pcb/25 text-pcb"
                    }`}
                    onClick={() => setTab("Neet")}
                >
                    NEET SYLLABUS
                </button>
            </div>
            <div className="p-4 border-t-2 border-pcb">
                {tab === "Neet" ? <NeetSyallabus /> : <OverallSyallabus />}
            </div>
        </Suspense>
    );
}
