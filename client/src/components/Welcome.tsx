import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function Component({ name }: { name: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg shadow-sm"
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <Avatar className="h-10 w-10 ring-2 ring-purple-300">
                    <AvatarImage src="/user-avatar.png" alt={name} />
                    <AvatarFallback>
                        <User className="h-5 w-5 text-purple-500" />
                    </AvatarFallback>
                </Avatar>
            </motion.div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">
                    Welcome,
                </span>
                <motion.div
                    className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {name}
                </motion.div>
            </div>
            {isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-lg bg-blue-400 mix-blend-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.div>
    );
}
