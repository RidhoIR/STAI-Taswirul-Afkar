// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, Laporan, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown, EyeIcon } from "lucide-react";
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
import Delete from './delete';
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Laporan>[] = [
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
        accessorKey: "periode",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Periode
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{formatTanggalIndonesia(row.original.periode_awal)} - {formatTanggalIndonesia(row.original.periode_akhir)} </div>,
    },
    {
        accessorKey: "total_pemasukan",
        header: "Total Pemasukan",
        cell: ({ row }) => (
            <div className="capitalize text-green-600">
                <FormatRupiah value={Number(row.original.total_pemasukan)} />
            </div>
        ),
    },
    {
        accessorKey: "total_pengeluaran",
        header: "Total Pengeluaran",
        cell: ({ row }) => (
            <div className="capitalize text-red-500">
                <FormatRupiah value={Number(row.original.total_pengeluaran)} />
            </div>
        ),
    },
    {
        accessorKey: "saldo_awal",
        header: "Saldo Awal",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="uppercase"><FormatRupiah value={Number(row.original.saldo_awal)} /></div>
        ),
    },
    {
        accessorKey: "saldo_akhir",
        header: "Saldo Akhir",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className="uppercase"><FormatRupiah value={Number(row.original.saldo_akhir)} /></div>
        ),
    },


    // {
    //     accessorKey: "lain_lain",
    //     header: "Lain-lain",
    //     cell: ({ row }) => (
    //         // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
    //         <div className="capitalize">{row.original.lain_lain}</div>
    //     ),
    // },
    {
        accessorKey: "selisih",
        header: "Selisih",
        cell: ({ row }) => {
            const saldoAwal = Number(row.original.saldo_awal);
            const saldoAkhir = Number(row.original.saldo_akhir);
            const selisih = saldoAkhir - saldoAwal;

            return (
                <div className='text-blue-500'>
                    <FormatRupiah value={selisih} />
                </div>
            );
        },
    },
    // {
    //     accessorKey: "periode",
    //     header: "periode",
    //     cell: ({ row }) => {
    //         const tanggal = row.getValue("periode");
    //         // Pastikan tanggal dalam bentuk Date dan format dengan locale Indonesia
    //         const formattedDate = tanggal && typeof tanggal === 'string'
    //             ? format(new Date(tanggal), 'MMMM yyyy', { locale: id }) // Format dengan bulan dalam bahasa Indonesia
    //             : '-';

    //         return <div>{formattedDate}</div>;
    //     },
    // },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;

            const handleDownloadPDF = () => {
                window.open(route('admin.bendahara.laporan-keuangan.pdf', id), '_blank'); // buka tab baru untuk download PDF
            };

            const handleDownloadSlip = () => {
                window.open(route('admin.bendahara.honorarium.slip', id), '_blank'); // buka tab baru untuk download PDF
            };

            return (
                <div className="flex gap-2">
                    <Button variant="default" onClick={handleDownloadPDF}>PDF</Button>
                    <Link href={route("admin.bendahara.laporan.show", { id: id })}>
                        <Button variant="blue">Detail</Button>
                    </Link>
                    <Delete laporan={row.original} />
                </div>
            );
        },
    }


];
