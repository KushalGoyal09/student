import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } =
                    scrollContainerRef.current;
                setShowLeftArrow(scrollLeft > 0);
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
            }
        };

        handleScroll();
        scrollContainerRef.current?.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        return () => {
            scrollContainerRef.current?.removeEventListener(
                "scroll",
                handleScroll,
            );
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth / 2;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="w-full relative">
            {/* {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-md lg:hidden"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6 text-indigo-600" />
                </button>
            )} */}
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
            {/* {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-md lg:hidden"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6 text-indigo-600" />
                </button>
            )} */}
        </div>
    );
}
