// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, HonorProposal, HonorSkripsi, HonorSkripsiTugas, HonorUjian, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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

// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const HonorUjianColumn: ColumnDef<HonorUjian>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "nama",
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
        cell: ({ row }) => <div className="">{row.getValue("nama")}</div>,
    },
    {
        accessorKey: "tipe_ujian", // diperlukan untuk indexing
        header: "Tipe Ujian",
        accessorFn: (row) => {
            const tugas = row.tugas || [];
            const tipeSet = new Set(tugas.map((t: any) => t.tipe_ujian?.toUpperCase()));
            return Array.from(tipeSet).join(', ') || '-';
        },
        cell: ({ row }) => {
            return <span className="font-medium">{row.getValue("tipe_ujian")}</span>;
        },
    },
    {
        header: "Semester",
        accessorKey: "semester",
        cell: ({ row }) => {
            const sm = row.original.semester;
            return `${sm.tahun_ajaran} ${sm.semester}`;
        },
    },
    {
        header: "Tugas",
        cell: ({ row }) => {
            const tugas = row.original.tugas;
            if (tugas.length === 0) return <span className="italic text-gray-400">Tidak ada tugas</span>;

            return (
                <ul className="list-disc list-inside space-y-1 capitalize">
                    {tugas.map((item, index) => (
                        <li key={index}>
                            {item.jenis_tugas} :{" "}
                            {item.jumlah}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        header: "Total Honor",
        cell: ({ row }) => {
            const total = row.original.tugas.reduce((acc, item) => acc + item.honor_total, 0);
            return <FormatRupiah value={total} />;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;
            const honor_ujian = row.original;

            const handleDownloadPDF = () => {
                window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            const handleDownloadSlip = () => {
                window.open(route('admin.bendahara.honor-ujian.invoice', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    <Button variant="default" onClick={handleDownloadSlip}>
                        PDF
                    </Button>
                </div>
            );
        },
    }


];
