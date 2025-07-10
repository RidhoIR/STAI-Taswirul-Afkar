// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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

// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const AnggaranColumn: ColumnDef<Anggaran>[] = [
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
        accessorKey: "perihal",
        header: "Perihal",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("perihal")}</div>
        ),
    },
    {
        accessorKey: "nama",
        header: "Tridharma",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.tridharma.nama}</div>
        ),
    },
    {
        accessorKey: "anggaran",
        header: "File Anggaran",
        cell: ({ row }) => {
            const fileName = row.getValue("anggaran") as string; // Assuming this is the file name
            const fileUrl = route('pengurus.anggaran.download', { file: fileName }); // URL to download the file

            return (
                <div className="flex items-center">
                    <a href={fileUrl} download className="ml-2 text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faDownload} className="fa-fw text-2xl" />
                    </a>
                </div>
            );
        }
    },
    {
        accessorKey: "jumlah_anggaran",
        header: "Jumlah Anggaran",

        cell: ({ row }) => (

            <div className="capitalize"><FormatRupiah value={row.getValue("jumlah_anggaran")} /></div>
        ),
    },
    {
        accessorKey: "jumlah_anggaran_disetujui",
        header: "Anggaran Disetujui",
        cell: ({ row }) => (
            <div className="capitalize"><FormatRupiah value={row.getValue("jumlah_anggaran_disetujui")} /></div>
        ),
    },
    {
        accessorKey: "tgl_pengajuan",
        header: "Tgl Pengajuan",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tgl_pengajuan")}</div>
        ),
    },
    {
        accessorKey: "tgl_disetujui",
        header: "Tgl. Disetujui",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tgl_disetujui")}</div>
        ),
    },
    {
        accessorKey: "tgl_pencairan",
        header: "Tgl. Pencairan",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tgl_pencairan")}</div>
        ),
    },
    {
        accessorKey: "status_pencairan",
        header: "Status Pencairan",
        cell: ({ row }) => {
            const status_pencairan = row.getValue("status_pencairan") as string;

            let badgeClass = '';

            switch (status_pencairan) {
                case 'sudah':
                    badgeClass = 'bg-green-500 text-white font-bold';
                    break;
                case 'belum':
                    badgeClass = 'bg-yellow-500 text-black font-bold';
                    break;
                default:
                    badgeClass = 'bg-gray-500 text-white font-bold';
                    break;
            }

            return (
                <div className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
                    {status_pencairan}
                </div>
            );
        },
    },
    {
        accessorKey: "status_anggaran",
        header: "Status Pengajuan",
        cell: ({ row }) => {
            const status_anggaran = row.getValue("status_anggaran") as string;

            let badgeClass = '';

            switch (status_anggaran) {
                case 'disetujui':
                    badgeClass = 'bg-green-500 text-white font-bold';
                    break;
                case 'pending':
                    badgeClass = 'bg-yellow-500 text-black font-bold';
                    break;
                case 'ditolak':
                    badgeClass = 'bg-red-500 text-white font-bold';
                    break;
                default:
                    badgeClass = 'bg-gray-500 text-white font-bold';
                    break;
            }

            return (
                <div className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
                    {status_anggaran}
                </div>
            );
        },
    },

    {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("keterangan")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const anggaran = row.original

            return (

                <div className="flex gap-2 ">
                    {/* <Delete anggaran={anggaran} /> */}
                    {/* <Edit anggaran={anggaran} /> */}
                </div>
            )
        },
    },

];
