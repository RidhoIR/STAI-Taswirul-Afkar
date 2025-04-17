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
        accessorKey: "no_invoice",
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
        accessorFn: row => row.mahasiswa.name,
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
        accessorFn: row => row.jenis_pembayaran.nama_pembayaran,
        header: "Pembayaran",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="uppercase">{row.original.jenis_pembayaran.nama_pembayaran}</div>
        ),
    },
    {
        accessorFn: row => row.semester.tahun_ajaran + ' ' + row.semester.semester,
        header: "Semester",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="capitalize">{row.original.semester.tahun_ajaran} {row.original.semester.semester}</div>
        ),
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
