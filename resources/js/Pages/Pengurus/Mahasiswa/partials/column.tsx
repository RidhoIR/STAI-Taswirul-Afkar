// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Mahasiswa, User } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown } from "lucide-react";
// import Delete from "../delete";
import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Mahasiswa>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nim",
        header: "NIM",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nim")}</div>
        ),
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "semester_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Semester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.original.semester.tahun_ajaran + ' ' + row.original.semester.semester}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.original.status}</div>,
    },
    // {
    //     accessorKey: "role",
    //     header: "Role",
    //     cell: ({ row }) => {
    //         const role = row.getValue("role") as string;

    //         let badgeClass = '';

    //         switch (role) {
    //             case 'admin':
    //                 badgeClass = 'bg-green-500 text-white font-bold'; 
    //                 break;
    //             case 'pengurus':
    //                 badgeClass = 'bg-yellow-500 text-black font-bold';
    //                 break;
    //             case 'bendahara':
    //                 badgeClass = 'bg-blue-500 text-white font-bold'; 
    //                 break;
    //             default:
    //                 badgeClass = 'bg-gray-500 text-white font-bold'; 
    //                 break;
    //         }

    //         return (
    //             <div className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
    //                 {role}
    //             </div>
    //         );
    //     },
    // },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const mahasiswa = row.original

            return (

                <div className="flex gap-2 ">
                    {/* <Delete user={user} /> */}
                    <Edit mahasiswas={mahasiswa} />
                </div>
            )
        },
    },

];
