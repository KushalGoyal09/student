import Loading from "@/components/Loading";
import permissionAtom from "@/recoil/permission";
import { Role, userAtom } from "@/recoil/userAtom";
import { useState } from "react";
import { Suspense, lazy } from "react";
import { useRecoilValue } from "recoil";
const ExistingStudents = lazy(() => import("./Detail/StudentList"));
const NewAdmissions = lazy(() => import("./New/NewAdmissions"));

export default function Juniors() {
    const [tab, setTab] = useState<"new" | "all">("new");
    const role = useRecoilValue(userAtom);
    const permissions = useRecoilValue(permissionAtom);

    if (role !== Role.supervisor && role !== Role.admin) {
        return <ExistingStudents />;
    }

    if (role === Role.supervisor && !permissions?.AssaignMentor) {
        return <ExistingStudents />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        tab === "new"
                            ? "bg-pcb text-white"
                            : "bg-pcb/25 text-pcb"
                    }`}
                    onClick={() => setTab("new")}
                >
                    NEW ADMISSION
                </button>
                <button
                    className={`ml-4 px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        tab === "all"
                            ? "bg-pcb text-white"
                            : "bg-pcb/25 text-pcb"
                    }`}
                    onClick={() => setTab("all")}
                >
                    ALL JUNIORS
                </button>
            </div>
            <div className="p-4 border-t-2 border-pcb">
                {tab === "new" ? <NewAdmissions /> : <ExistingStudents />}
            </div>
        </Suspense>
    );
}
