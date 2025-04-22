// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Mahasiswa, TanggunganPembayaran, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
export const columnTanggungan: ColumnDef<TanggunganPembayaran>[] = [
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
        accessorFn: row => row.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran,
        header: "Jenis Pembayaran",
        cell: ({ row }) => (
            // console.log(row.original.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran),
            <div className="uppercase">{row.original.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran}</div>
        ),
    },
    {
        accessorFn: row => row.detail_jenis_pembayaran.semester.semester + ' ' + row.detail_jenis_pembayaran.semester.tahun_ajaran,
        header: "Semester",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="capitalize">{row.original.detail_jenis_pembayaran.semester.semester} {row.original.detail_jenis_pembayaran.semester.tahun_ajaran}</div>
        ),
    },
    {
        accessorFn: row => row.detail_jenis_pembayaran.jumlah,
        header: "Harga",
        cell: ({ row }) => (
            <div className="capitalize text-green-500 font-medium">
                <FormatRupiah value={Number(row.original.detail_jenis_pembayaran.jumlah)} />
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status Pencairan",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            let badgeClass = '';

            switch (status) {
                case 'lunas':
                    badgeClass = 'bg-green-500 text-white font-bold';
                    break;
                case 'belum_bayar':
                    badgeClass = 'bg-yellow-500 text-black font-bold';
                    break;
                default:
                    badgeClass = 'bg-gray-500 text-white font-bold';
                    break;
            }

            return (
                <div className={`uppercase inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
                    {status}
                </div>
            );
        },
    },
    // {
    //     accessorKey: "tanggal_pembayaran",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="default"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Tgl. Pembayaran
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const tanggal = row.getValue("tanggal_pembayaran");
    //         // Pastikan tanggal dalam bentuk Date dan format dengan locale Indonesia
    //         const formattedDate = tanggal && typeof tanggal === 'string'
    //             ? format(new Date(tanggal), 'dd MMMM yyyy', { locale: id }) // Format dengan bulan dalam bahasa Indonesia
    //             : '-';

    //         return <div>{formattedDate}</div>;
    //     },
    // },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {

    //         const id = row.original.id;

    //         const handleDownloadPDF = () => {
    //             window.open(route('transaksi.pdf', id), '_blank'); // buka tab baru untuk download PDF
    //         };

    //         return (
    //             <div className="flex">
    //                 <Button variant="default" onClick={handleDownloadPDF}>
    //                     PDF
    //                 </Button>
    //             </div>
    //         );
    //     },
    // }


];
