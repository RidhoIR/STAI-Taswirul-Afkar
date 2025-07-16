// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, HonorSkripsi, HonorSkripsiTugas, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import Edit from './edit';
import Delete from './delete';
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<HonorSkripsi>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "nama",
        header: "Nama",
    },
    {
        header: "Semester",
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
            const total = row.original.tugas.reduce((acc, item) => Number(acc) + Number(item.honor_total), 0);
            return <FormatRupiah value={total} />;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;
            const honor_skripsi = row.original;

            const handleDownloadPDF = () => {
                window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            const handleDownloadSlip = () => {
                window.open(route('admin.bendahara.honor-skripsi.invoice', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    <Button variant="default" onClick={handleDownloadSlip}>
                        PDF
                    </Button>
                    <Edit honor_skripsi={honor_skripsi} />
                    <Delete Honor_skripsi={honor_skripsi} />
                </div>
            );
        },
    }


];
