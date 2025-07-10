// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Jenis_pembayaran, DetailJenisPembayaran, Mahasiswa, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import { Row } from "react-day-picker";
import Edit from "../edit";
import Delete from "../delete";
// import Edit from "../edit";
// import Delete from "../delete";
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<DetailJenisPembayaran>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorFn: row => row.jenis_pembayaran.nama_pembayaran,
        id: 'nama_pembayaran',
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Nama Pembayaran
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="uppercase">
                {row.original.jenis_pembayaran.nama_pembayaran}
            </div>
        ),
    },
    {
        accessorKey: "semester",
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
        cell: ({ row }) => <div className="capitalize">
            {row.original.semester ? `${row.original.semester.semester} ${row.original.semester.tahun_ajaran}` : <span className="text-red-500">Tidak ada semester</span>}
        </div>
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
            const detail_jenis_pembayaran = row.original

            return (

                <div className="flex gap-2">
                    <Edit detail_jenis_pembayaran={detail_jenis_pembayaran} />
                    <Delete detail_jenis_pembayaran={detail_jenis_pembayaran} />
                    {/* <Delete jenis_pembayaran={jenis_pembayaran} />
                    <Edit jenis_pembayaran={jenis_pembayaran} /> */}
                    {/* <Link href={route("admin.bendahara.riwayat-pembayaran.detail-mahasiswa", { mahasiswa_id: mahasiswa.id })}>
                        <Button variant="blue">Pembayaran</Button>
                    </Link> */}
                </div>
            )
        },
    },

];
