// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import { format } from "date-fns";
import { id } from 'date-fns/locale';  // Import lokal Indonesia

// import Edit from "../edit";
import { FormatRupiah } from "@arismun/format-rupiah";
import { get } from "http";
import Edit from '../edit';
import Delete from '../delete';
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Honorarium>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "jumlah_mk",
        header: "Jumlah MK",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.jumlah_mk}</div>
        ),
    },
    {
        accessorKey: "honor_mk",
        header: "Honor MK",
        cell: ({ row }) => (
            <div className="capitalize">
                <FormatRupiah value={Number(row.original.honor_mk)} />
            </div>
        ),
    },

    {
        accessorKey: "jabatan.name",
        header: "Jabatan",
        cell: ({ row }) => (
            <div className="uppercase">
                {row.original.jabatan?.name ?? '-'}
            </div>
        )
    },
    {
        accessorKey: "lain_lain",
        header: "Lain-lain",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="capitalize">
                <FormatRupiah value={Number(row.original.lain_lain)} />
            </div>
        ),
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="capitalize">
                <FormatRupiah value={Number(row.original.jumlah)} />
            </div>
        ),
    },
    {
        accessorKey: "periode",
        header: "periode",
        cell: ({ row }) => {
            const tanggal = row.getValue("periode");
            // Pastikan tanggal dalam bentuk Date dan format dengan locale Indonesia
            const formattedDate = tanggal && typeof tanggal === 'string'
                ? format(new Date(tanggal), 'MMMM yyyy', { locale: id }) // Format dengan bulan dalam bahasa Indonesia
                : '-';

            return <div>{formattedDate}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;

            const handleDownloadPDF = () => {
                window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            const handleDownloadSlip = () => {
                window.open(route('admin.bendahara.honorarium.slip', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    <Edit honorarium={row.original} />
                    <Delete honorarium={row.original} />
                    <Button variant="default" onClick={handleDownloadSlip}>
                        PDF
                    </Button>
                </div>
            );
        },
    }


];
