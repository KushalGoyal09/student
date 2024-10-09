import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Role } from "@/recoil/userAtom";

interface Links {
    role: Array<Role | null>;
    label: string;
    path: string;
}

export default function ScrollableTabs({
    filteredLinks,
}: {
    filteredLinks: Links[];
}) {
    const [activeTab, setActiveTab] = useState(filteredLinks[0]?.path || "/");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full relative">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory lg:overflow-x-visible lg:flex-wrap"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {filteredLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `p-5 font-semibold transition-colors duration-200 flex-shrink-0 text-center snap-start
                            lg:flex-1 lg:flex-shrink lg:snap-none ${
                                isActive || activeTab === link.path
                                    ? "bg-pcb/10 text-pcb"
                                    : "bg-pcb text-white"
                            }`
                        }
                        onClick={() => setActiveTab(link.path)}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
