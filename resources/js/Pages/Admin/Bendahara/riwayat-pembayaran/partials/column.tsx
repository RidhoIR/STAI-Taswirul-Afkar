// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Transaksi>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "no_invoice",
        id: "no_invoice",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invoice
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("no_invoice")}</div>,
    },
    {
        header: "Nama",
        accessorKey: "mahasiswa.name",
        cell: ({ row }) => <div className="capitalize">{row.original.mahasiswa.name}</div>
    },
    {
        accessorFn: row => row.mahasiswa.prodi,
        header: "Prodi",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.mahasiswa.prodi}</div>
        ),
    },
    {
        accessorFn: row => row.mahasiswa.tahun_masuk,
        header: "Angkatan",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.mahasiswa.tahun_masuk}</div>
        ),
    },

    {
        accessorFn: row => row.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran,
        header: "Jenis Pembayaran",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="uppercase">{row.original.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran}</div>
        ),
    },
    {
        accessorFn: row => row.detail_jenis_pembayaran.semester.semester + ' ' + row.detail_jenis_pembayaran.semester.tahun_ajaran,
        header: "Semester",
        cell: ({ row }) => {
            const semester = row.original.detail_jenis_pembayaran.semester;
            return (
                <div className="capitalize">
                    {semester
                        ? `${semester.semester} ${semester.tahun_ajaran}`
                        : <span className="">-</span>
                    }
                </div>
            );
        },
    },
    {
        accessorKey: "tanggal_pembayaran",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tgl. Pembayaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const tanggal = row.getValue("tanggal_pembayaran");

            // Pastikan tanggal dalam bentuk Date dan format dengan locale Indonesia
            const formattedDate = tanggal && typeof tanggal === 'string'
                ? format(new Date(tanggal), 'dd MMMM yyyy', { locale: id }) // Format dengan bulan dalam bahasa Indonesia
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

            return (
                <div className="flex">
                    <Button variant="default" onClick={handleDownloadPDF}>
                        PDF
                    </Button>
                </div>
            );
        },
    }


];
