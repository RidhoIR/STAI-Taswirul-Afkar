// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Mahasiswa, Semester, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import { formatTanggalIndonesia } from '@/lib/utils';
import Edit from './edit';
import Delete from './delete';
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Semester>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: "Semester",
        accessorFn: row => row.semester,
        cell: ({ row }) => <div className="capitalize">{row.original.semester}</div>
    },    
    {
        accessorFn: row => row.tahun_ajaran,
        header: "Tahun Ajaran",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.tahun_ajaran}</div>
        ),
    },
    {
        accessorFn: row => row.tanggal_mulai.toString(),
        header: "Tanggal Mulai",
        cell: ({ row }) => (
            <div className="capitalize">{formatTanggalIndonesia(row.original.tanggal_mulai.toString())}</div>
        ),
    },
    
    {
        accessorFn: row => row.tanggal_mulai.toString(),
        header: "Tanggal Selesai",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="capitalize">{formatTanggalIndonesia(row.original.tanggal_selesai.toString())}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;
            const semester = row.original;

            const handleDownloadPDF = () => {
                window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    <Edit semesters={semester} />
                    <Delete semester={semester} />
                    {/* <Button variant="default" onClick={handleDownloadPDF}>
                        PDF
                    </Button> */}
                </div>
            );
        },
    }


];
