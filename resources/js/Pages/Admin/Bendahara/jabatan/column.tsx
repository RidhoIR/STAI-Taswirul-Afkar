// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, HonorPPL, HonorSkripsi, HonorWisuda, Jabatan, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
export const column: ColumnDef<Jabatan>[] = [
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
        accessorKey: "honor",
        header: "Honor",
        cell: ({ row }) => (
            <div className="capitalize">
                <FormatRupiah value={Number(row.original.honor)} />
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;
            const jabatan = row.original;

            const handleDownloadPDF = () => {
                window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            const handleDownloadSlip = () => {
                window.open(route('admin.bendahara.honor-wisuda.invoice', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    {/* <Button variant="default" onClick={handleDownloadSlip}>
                        PDF
                    </Button> */}
                    <Edit jabatan={jabatan} />
                    <Delete jabatan={jabatan} />
                </div>
            );
        },
    }


];
