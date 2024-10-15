import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
interface Student {
    id: string;
    name: string;
    callNumber: string;
    kitDispatched: boolean;
    kitReady: boolean;
    kitDispatchedDate: Date | null;
}

const KitDispatchPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [nameSearch, setNameSearch] = useState("");
    const [sortBy, setSortBy] = useState<
        "name" | "kitDispatched" | "kitDispatchedDate"
    >("kitDispatched");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [dispatchFilter, setDispatchFilter] = useState<
        "all" | "dispatched" | "notDispatched"
    >("all");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const fetchKitDispatchData = async () => {
            try {
                const { data } = await axios.get("/api/new/kit-data", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStudents(data.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch kit dispatch data",
                    variant: "destructive",
                });
            }
        };
        fetchKitDispatchData();
    }, []);

    const handleMarkDispatched = async (studentId: string) => {
        const date = new Date();
        try {
            await axios.post(
                "/api/new/kit-dispatch",
                {
                    studentId,
                    date,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === studentId
                        ? {
                              ...student,
                              kitDispatched: true,
                              kitDispatchedDate: date,
                          }
                        : student,
                ),
            );
            toast({
                title: "Success",
                description: "Kit marked as dispatched",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark kit dispatched",
                variant: "destructive",
            });
        }
    };

    const filteredAndSortedStudents = useMemo(() => {
        return students
            .filter(
                (student) =>
                    student.name
                        .toLowerCase()
                        .includes(nameSearch.toLowerCase()) &&
                    (dispatchFilter === "all" ||
                        (dispatchFilter === "dispatched" &&
                            student.kitDispatched) ||
                        (dispatchFilter === "notDispatched" &&
                            !student.kitDispatched)),
            )
            .sort((a, b) => {
                if (sortBy === "name") {
                    return sortOrder === "asc"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (sortBy === "kitDispatched") {
                    return sortOrder === "asc"
                        ? Number(a.kitDispatched) - Number(b.kitDispatched)
                        : Number(b.kitDispatched) - Number(a.kitDispatched);
                } else {
                    const dateA = a.kitDispatchedDate
                        ? new Date(a.kitDispatchedDate)
                        : new Date(0);
                    const dateB = b.kitDispatchedDate
                        ? new Date(b.kitDispatchedDate)
                        : new Date(0);
                    return sortOrder === "asc"
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                }
            });
    }, [students, nameSearch, sortBy, sortOrder, dispatchFilter]);

    const handleDownload = (exportFormat: "xlsx" | "pdf" | "docx") => {
        const data = filteredAndSortedStudents.map((student) => ({
            Name: student.name,
            Status: student.kitDispatched ? "Dispatched" : "Not Dispatched",
            "Date of Dispatch": student.kitDispatchedDate
                ? format(new Date(student.kitDispatchedDate), "PP")
                : "-",
        }));

        if (exportFormat === "xlsx") {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
            XLSX.writeFile(workbook, "student_kit_dispatch.xlsx");
        } else if (exportFormat === "pdf") {
            const doc = new jsPDF();
            autoTable(doc, {
                head: [["Name", "Status", "Date of Dispatch"]],
                body: data.map(Object.values),
            });
            doc.save("student_kit_dispatch.pdf");
        } else if (exportFormat === "docx") {
            let content = "Name\tStatus\tDate of Dispatch\n";
            data.forEach((row) => {
                content += `${row.Name}\t${row.Status}\t${row["Date of Dispatch"]}\n`;
            });
            const blob = new Blob([content], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "student_kit_dispatch.txt";
            link.click();
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Junior Kit Status</h1>
            <div className="space-y-4 p-4">
                <Input
                    placeholder="Search by name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="w-full"
                    aria-label="Search by name"
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filter & Sort
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-md"
                        >
                            <SheetHeader>
                                <SheetTitle>Filter and Sort Options</SheetTitle>
                                <SheetDescription>
                                    Adjust your view preferences here.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <label
                                        htmlFor="sort-by"
                                        className="text-sm font-medium"
                                    >
                                        Sort by
                                    </label>
                                    <Select
                                        value={sortBy}
                                        onValueChange={(value) =>
                                            setSortBy(value as typeof sortBy)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">
                                                Name
                                            </SelectItem>
                                            <SelectItem value="kitDispatched">
                                                Kit Status
                                            </SelectItem>
                                            <SelectItem value="kitDispatchedDate">
                                                Dispatch Date
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label
                                        htmlFor="sort-order"
                                        className="text-sm font-medium"
                                    >
                                        Sort Order
                                    </label>
                                    <Button
                                        id="sort-order"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setSortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc",
                                            )
                                        }
                                        aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
                                    >
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label
                                        htmlFor="dispatch-filter"
                                        className="text-sm font-medium"
                                    >
                                        Filter by dispatch
                                    </label>
                                    <Select
                                        value={dispatchFilter}
                                        onValueChange={(value) =>
                                            setDispatchFilter(
                                                value as typeof dispatchFilter,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by dispatch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="dispatched">
                                                Dispatched
                                            </SelectItem>
                                            <SelectItem value="notDispatched">
                                                Not Dispatched
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleDownload("xlsx")}
                            >
                                Download Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDownload("pdf")}
                            >
                                Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDownload("docx")}
                            >
                                Download Word
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedStudents.map((student) => (
                    <Card key={student.id} className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {student.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-1 text-sm">
                                <dt className="font-medium">Call Number:</dt>
                                <dd>{student.callNumber}</dd>
                                <dt className="font-medium">Kit Status:</dt>
                                <dd>
                                    <Badge
                                        variant={
                                            student.kitDispatched
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {student.kitDispatched
                                            ? "Dispatched"
                                            : "Pending"}
                                    </Badge>
                                </dd>
                                <dt className="font-medium">Dispatch Date:</dt>
                                <dd>
                                    {student.kitDispatchedDate
                                        ? format(
                                              new Date(
                                                  student.kitDispatchedDate,
                                              ),
                                              "PP",
                                          )
                                        : "-"}
                                </dd>
                            </dl>
                            <div className="mt-4 space-y-2">
                                <Link
                                    to={`/profile/${student.id}`}
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        View Profile
                                    </Button>
                                </Link>
                                {!student.kitDispatched && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                            handleMarkDispatched(student.id)
                                        }
                                    >
                                        Mark Dispatched
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default KitDispatchPage;
