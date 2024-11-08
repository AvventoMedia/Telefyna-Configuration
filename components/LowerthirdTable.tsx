import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import RegularButton from "@/components/RegularButton";
import { v4 as uuidv4 } from "uuid";

interface DataRow {
    id: string;
    delete: boolean;
    replays: number | "";
    file: string;
    starts: string;
}

const LowerthirdTable = () => {
    const [rows, setRows] = useState<DataRow[]>([
        { id: uuidv4(), delete: false, replays: "", file: "", starts: "" },
    ]);

    const handleInputChange = (id: string, field: keyof DataRow, value: string | number) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleCheckboxChange = (id: string) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, delete: !row.delete } : row
            )
        );
    };

    const handleDeleteSelected = () => {
        setRows((prevRows) => prevRows.filter((row) => !row.delete));
    };

    const handleAddRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            { id: uuidv4(), delete: false, replays: "", file: "", starts: "" },
        ]);
    };

    const allInputsFilled = rows.every(
        (row) => row.replays !== "" && row.file !== "" && row.starts !== ""
    );

    return (
        <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
            <Table className="border-collapse border border-gray-300 w-full">
                <TableHeader>
                    <TableRow className="bg-green-500">
                        <TableHead className="border border-dark-500 text-center p-2 text-white">Delete</TableHead>
                        <TableHead className="border border-dark-500 text-center p-2 text-white">Replays</TableHead>
                        <TableHead className="border border-dark-500 text-center p-2 text-white">File</TableHead>
                        <TableHead className="border border-dark-500 text-center p-2 text-white">Starts (separated by
                            #)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} >
                            <TableCell className="border border-dark-500 text-center p-2">
                                <Checkbox
                                    checked={row.delete}
                                    className="text-white"
                                    onCheckedChange={() => handleCheckboxChange(row.id)}
                                />
                            </TableCell>
                            <TableCell className="border border-dark-500 text-center p-2">
                                <Input
                                    type="number"
                                    value={row.replays}
                                    placeholder="Number of replays"
                                    onChange={(e) => handleInputChange(row.id, "replays", parseInt(e.target.value) || "")}
                                    className="w-full text-white"
                                />
                            </TableCell>
                            <TableCell className="border border-dark-500 text-center p-2">
                                <Input
                                    type="text"
                                    value={row.file}
                                    placeholder="e.g /file.mp4"
                                    onChange={(e) => handleInputChange(row.id, "file", e.target.value)}
                                    className="w-full text-white"
                                />
                            </TableCell>
                            <TableCell className="border border-dark-500 text-center p-2">
                                <Input
                                    type="text"
                                    placeholder="e.g 10#14"
                                    value={row.starts}
                                    onChange={(e) => handleInputChange(row.id, "starts", e.target.value)}
                                    className="w-full text-white"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between m-4">
                <RegularButton variant="destructive" name="Delete Selected" isLoading={!rows.some((row) => row.delete)}
                               onClick={handleDeleteSelected} className="shad-danger-btn flex items-center gap-2">
                    <Trash className="w-4 h-4"/> Delete Selected
                </RegularButton>
                <RegularButton isLoading={!allInputsFilled} name="Add Row" onClick={handleAddRow}
                               className="shad-primary-btn flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Row
                </RegularButton>
            </div>
        </div>
    );
};

export default LowerthirdTable;
