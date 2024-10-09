import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Line {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    angle: number;
}

const MovingLine = ({ line }: { line: Line }) => (
    <motion.div
        className="absolute bg-white/20 rounded-full"
        style={{
            width: line.length,
            height: 2,
            x: line.x,
            y: line.y,
            rotate: line.angle,
        }}
        animate={{ x: line.x, y: line.y, rotate: line.angle }}
        transition={{ type: "tween", duration: 0.05 }}
    />
);

export default function WelcomeComponent() {
    const [lines, setLines] = useState<Line[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const containerWidth =
            containerRef.current?.clientWidth || window.innerWidth;
        const containerHeight =
            containerRef.current?.clientHeight || window.innerHeight;

        const initialLines: Line[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * containerWidth,
            y: Math.random() * containerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            length: Math.random() * 100 + 50,
            angle: Math.random() * 360,
        }));

        setLines(initialLines);

        const animateLines = () => {
            setLines((prevLines) =>
                prevLines.map((line) => {
                    let newX = line.x + line.vx;
                    let newY = line.y + line.vy;

                    if (newX < 0 || newX > containerWidth) line.vx *= -1;
                    if (newY < 0 || newY > containerHeight) line.vy *= -1;

                    newX = Math.max(0, Math.min(newX, containerWidth));
                    newY = Math.max(0, Math.min(newY, containerHeight));

                    return {
                        ...line,
                        x: newX,
                        y: newY,
                        angle: Math.atan2(line.vy, line.vx) * (180 / Math.PI),
                    };
                }),
            );
        };

        const intervalId = setInterval(animateLines, 50);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-blue-600 via-pcb/80 to-pink-600"
        >
            {lines.map((line) => (
                <MovingLine key={line.id} line={line} />
            ))}

            <motion.div
                className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center max-w-md w-full z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                >
                    <img
                        src="/pcb-point-logo.png"
                        alt="The PCB Point Logo"
                        className="w-20 h-20 mx-auto mb-6 text-primary"
                    />
                </motion.div>
                <motion.h1
                    className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Welcome to PCB Point Family
                </motion.h1>
                <motion.p
                    className="mb-8 text-gray-200 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    Login to access the dashboard
                </motion.p>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/login">
                        <Button
                            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Login
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
