// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Jenis_pembayaran, Mahasiswa, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import Edit from "../edit";
import Delete from "../delete";
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Jenis_pembayaran>[] = [
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
        accessorKey: "nama_pembayaran",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Pembayaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("nama_pembayaran")}</div>,
    },
    {
        accessorKey: "jumlah",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Harga
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">
            <FormatRupiah value={row.getValue("jumlah")} />
        </div>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const jenis_pembayaran = row.original

            return (

                <div className="flex gap-2">
                    <Delete jenis_pembayaran={jenis_pembayaran} />
                    <Edit jenis_pembayaran={jenis_pembayaran} />
                    {/* <Link href={route("admin.bendahara.riwayat-pembayaran.detail-mahasiswa", { mahasiswa_id: mahasiswa.id })}>
                        <Button variant="blue">Pembayaran</Button>
                    </Link> */}
                </div>
            )
        },
    },

];
