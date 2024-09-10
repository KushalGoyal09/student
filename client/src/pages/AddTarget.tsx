"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Share2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Target {
    id: string;
    subject: string;
    chapter: string;
    lectureDay: string;
    fromDate: string;
    toDate: string;
}

export default function MentorTargetPage() {
    const [targets, setTargets] = useState<Target[]>([]);
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const [lectureDay, setLectureDay] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreateTarget = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!subject || !chapter || !lectureDay || !fromDate || !toDate) {
            setError("Please fill in all fields");
            return;
        }

        const newTarget: Target = {
            id: (targets.length + 1).toString(),
            subject,
            chapter,
            lectureDay,
            fromDate,
            toDate,
        };

        setTargets([...targets, newTarget]);
        setSubject("");
        setChapter("");
        setLectureDay("");
        setFromDate("");
        setToDate("");
        setSuccess("Target created successfully");

        // In a real application, you'd make an API call here
        console.log("New target created:", newTarget);
    };

    const handleCopyTarget = (target: Target) => {
        const targetText = `Subject: ${target.subject}\nChapter: ${target.chapter}\nLecture/Day: ${target.lectureDay}\nFrom: ${target.fromDate}\nTo: ${target.toDate}`;
        navigator.clipboard.writeText(targetText).then(
            () => {
                toast({
                    title: "Copied to clipboard",
                    description:
                        "The target details have been copied to your clipboard.",
                });
            },
            (err) => {
                console.error("Could not copy text: ", err);
            },
        );
    };

    const handleShareWhatsApp = (target: Target) => {
        const message = `New target:\nSubject: ${target.subject}\nChapter: ${target.chapter}\nLecture/Day: ${target.lectureDay}\nFrom: ${target.fromDate}\nTo: ${target.toDate}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Create and Share Targets
            </h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Create New Target</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateTarget} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter subject"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="chapter">Chapter</Label>
                            <Input
                                id="chapter"
                                value={chapter}
                                onChange={(e) => setChapter(e.target.value)}
                                placeholder="Enter chapter"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lectureDay">Lecture/Day</Label>
                            <Input
                                id="lectureDay"
                                value={lectureDay}
                                onChange={(e) => setLectureDay(e.target.value)}
                                placeholder="Enter lecture or day"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fromDate">From Date</Label>
                            <Input
                                id="fromDate"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="toDate">To Date</Label>
                            <Input
                                id="toDate"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Target
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <div className="flex items-center space-x-2 text-red-600 mb-4">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            {success && (
                <div className="flex items-center space-x-2 text-green-600 mb-4">
                    <CheckCircle2 size={16} />
                    <span className="text-sm">{success}</span>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Existing Targets</CardTitle>
                </CardHeader>
                <CardContent>
                    {targets.length > 0 ? (
                        <ul className="space-y-4">
                            {targets.map((target) => (
                                <li
                                    key={target.id}
                                    className="border p-4 rounded-md"
                                >
                                    <div className="flex flex-col space-y-2">
                                        <h3 className="font-semibold">
                                            {target.subject}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Chapter: {target.chapter}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Lecture/Day: {target.lectureDay}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            From: {target.fromDate} To:{" "}
                                            {target.toDate}
                                        </p>
                                        <div className="flex space-x-2 mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleCopyTarget(target)
                                                }
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleShareWhatsApp(target)
                                                }
                                            >
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">
                            No targets created yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
