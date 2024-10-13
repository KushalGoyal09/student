import { useState, useRef, useEffect } from "react";
import { Info, Users, DollarSign, Target, PhoneCall } from "lucide-react";
import { Role, userAtom } from "@/recoil/userAtom";
import { useRecoilValue } from "recoil";
import CallRecord from "./Call";
import TargetComponent from "./Target";
import InfoComponent from "./Info";
import AssignMentor from "./AssaignMentor";
import { useParams } from "react-router-dom";
import Fee from "./Fee/Fee";
import VisionBoardComponent from "./VisionBoard";
import permissionAtom from "@/recoil/permission";

type TabType =
    | "Info"
    | "AssignMentor"
    | "FeeDetail"
    | "Target"
    | "Calling"
    | "Vision Board";

const tabConfig: {
    [key in TabType]: {
        icon: React.ReactNode;
        label: string;
        role: Array<Role>;
        permissionCheck?: (permissions: Permission | null) => boolean;
    };
} = {
    Info: {
        icon: <Info className="w-5 h-5" />,
        label: "Info",
        role: [
            Role.admin,
            Role.groupMentor,
            Role.seniorMentor,
            Role.supervisor,
        ],
    },
    AssignMentor: {
        icon: <Users className="w-5 h-5" />,
        label: "Assign Mentor",
        role: [Role.admin],
        permissionCheck: (permissions) => permissions?.AssaignMentor || false,
    },
    FeeDetail: {
        icon: <DollarSign className="w-5 h-5" />,
        label: "Fee Detail",
        role: [Role.admin],
        permissionCheck: (permissions) => permissions?.FeeManagement || false,
    },
    Target: {
        icon: <Target className="w-5 h-5" />,
        label: "Target",
        role: [
            Role.admin,
            Role.groupMentor,
            Role.seniorMentor,
            Role.supervisor,
        ],
    },
    Calling: {
        icon: <PhoneCall className="w-5 h-5" />,
        label: "Calling",
        role: [
            Role.admin,
            Role.groupMentor,
            Role.seniorMentor,
            Role.supervisor,
        ],
    },
    "Vision Board": {
        icon: <PhoneCall className="w-5 h-5" />,
        label: "Vision Board",
        role: [
            Role.admin,
            Role.groupMentor,
            Role.seniorMentor,
            Role.supervisor,
        ],
    },
};

interface Permission {
    FeeManagement: boolean;
    KitDispatch: boolean;
    AssaignMentor: boolean;
}

export default function StudentProfile() {
    const tabsRef = useRef<HTMLDivElement>(null);
    const userRole = useRecoilValue(userAtom);
    const userPermission = useRecoilValue(permissionAtom);
    const { id } = useParams();
    if (!id) {
        return null;
    }

    const allowedTabs = Object.entries(tabConfig).filter(([_, config]) => {
        // Check if the user's role allows the tab or if there's a permission check that passes
        const hasRoleAccess = userRole ? config.role.includes(userRole) : false;
        const hasPermissionAccess = config.permissionCheck
            ? config.permissionCheck(userPermission)
            : true;
        return hasRoleAccess || hasPermissionAccess;
    });

    const [tab, setTab] = useState<TabType>(
        allowedTabs.length > 0 ? (allowedTabs[0][0] as TabType) : "Info",
    );

    useEffect(() => {
        const tabElement = document.getElementById(tab);
        if (tabElement && tabsRef.current) {
            const containerRect = tabsRef.current.getBoundingClientRect();
            const tabRect = tabElement.getBoundingClientRect();
            const scrollLeft =
                tabElement.offsetLeft -
                containerRect.width / 2 +
                tabRect.width / 2;
            tabsRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    }, [tab]);

    const renderContent = () => {
        switch (tab) {
            case "Info":
                return <InfoComponent id={id} />;
            case "AssignMentor":
                return <AssignMentor studentId={id} />;
            case "FeeDetail":
                return <Fee studentId={id} />;
            case "Target":
                return <TargetComponent studentId={id} />;
            case "Calling":
                return <CallRecord studentId={id} />;
            case "Vision Board":
                return <VisionBoardComponent studentId={id} />;
        }
    };

    if (!userRole || allowedTabs.length === 0) {
        return <div>No tabs available for your role.</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto sm:p-6 bg-white rounded-lg shadow-lg">
            <div
                ref={tabsRef}
                className="flex justify-evenly overflow-x-auto scrollbar-hide space-x-1 rounded-lg bg-pcb/10"
            >
                {allowedTabs.map(([key, { icon, label }]) => (
                    <button
                        id={key}
                        key={key}
                        onClick={() => setTab(key as TabType)}
                        className={`flex flex-shrink-0 items-center space-x-2 px-3 py-5 rounded-md transition-colors duration-150 ${
                            tab === key
                                ? "bg-white text-pcb shadow-sm"
                                : "text-pcb hover:bg-blue-50"
                        }`}
                    >
                        {icon}
                        <span className="font-medium text-sm sm:text-base">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
            {renderContent()}
        </div>
    );
}
