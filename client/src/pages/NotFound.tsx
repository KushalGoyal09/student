import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-9xl font-extrabold text-gray-800">
                        404
                    </h1>
                    <h2 className="text-4xl font-bold text-gray-700">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-gray-600">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button asChild className="flex items-center space-x-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Go back home</span>
                        </Link>
                    </Button>
                </div>
                <div className="pt-8 text-sm text-gray-500">
                    <p>
                        If you believe this is a mistake, please contact our
                        support team.
                    </p>
                </div>
            </div>
        </div>
    );
}
