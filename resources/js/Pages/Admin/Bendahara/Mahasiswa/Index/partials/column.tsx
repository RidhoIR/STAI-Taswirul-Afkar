// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Mahasiswa, User } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown } from "lucide-react";
import { BsCloudDownload, BsDownload, BsFileArrowDown, BsFileArrowDownFill, BsFileBarGraph, BsFillCloudDownloadFill } from "react-icons/bs";
import { IconFileDownload, IconFileDownloadFill } from "@irsyadadl/paranoid";
import { FaFontAwesome } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileDownload, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
// import Edit from "../edit";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Link } from "@inertiajs/react";
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
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
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    NIM
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("nim")}</div>,
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "prodi",
        header: "Prodi",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("prodi")}</div>
        ),
    },
    {
        accessorKey: "tahun_masuk",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Angkatan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("tahun_masuk")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const mahasiswa = row.original

            return (

                <div className="flex">
                    {/* <Delete anggaran={anggaran} /> */}
                    {/* <Edit anggaran={anggaran} /> */}
                    <Link href={route("admin.bendahara.riwayat-pembayaran.detail-mahasiswa", { mahasiswa_id: mahasiswa.id } )}>
                        <Button variant="blue">Pembayaran</Button>
                    </Link>

                    <Link href={route("admin.bendahara.tanggungan-mahasiswa.index", { id: mahasiswa.id } )}>
                        <Button variant="blue">Tanggungan</Button>
                    </Link>
                </div>
            )
        },
    },

];
