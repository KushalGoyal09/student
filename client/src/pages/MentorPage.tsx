import { Link } from "react-router-dom";
import {Plus, CircleCheck} from 'lucide-react'

export default function MentorPage() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-pcb/25">
            <div className="p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-center text-pcb mb-8">
                    MENTORS
                </h1>

                <div className="space-y-4">
                    <div className="bg-purple-600 rounded-lg p-4">
                        <span className="block bg-purple-700 text-white text-xl font-bold py-3 px-2 rounded-lg mb-4">
                            <span className="flex items-center">
                                <CircleCheck className="w-6 h-6 mr-2"/>
                                EXISTING MENTORS
                            </span>
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <Link
                                to="/supervisor"
                                className="bg-purple-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                SUPERVISOR
                            </Link>
                            <Link
                                to="/seniorMentor"
                                className="bg-purple-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                SENIOR MENTOR
                            </Link>
                            <Link
                                to="/mentor"
                                className="bg-purple-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                GROUP MENTOR
                            </Link>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-lg p-4">
                        <span className="block bg-blue-700 text-white text-xl font-bold py-3 px-4 rounded-lg mb-4">
                            <span className="flex items-center">
                                <Plus className="w-6 h-6 mr-2"/>
                                ADD NEW MENTOR
                            </span>
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <Link
                                to="/add/supervisor"
                                className="bg-blue-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                SUPERVISOR
                            </Link>
                            <Link
                                to="/add/senior-mentor"
                                className="bg-blue-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                SENIOR MENTOR
                            </Link>
                            <Link
                                to="/add/mentor"
                                className="bg-blue-500 text-white text-center py-2 px-3 rounded-lg text-sm"
                            >
                                GROUP MENTOR
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
