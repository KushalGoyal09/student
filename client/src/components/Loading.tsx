import React from "react";
import { Loader2 } from "lucide-react";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <Loader2 className="text-blue-500" />
                <p className="mt-4 text-lg text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
