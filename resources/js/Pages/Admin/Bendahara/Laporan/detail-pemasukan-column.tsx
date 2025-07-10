// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, DetailLaporan, Honorarium, Laporan, Mahasiswa, Transaksi, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
import { Badge } from '@/Components/ui/badge';
// import Update from "../update";


// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const DetailPemasukanColumn: ColumnDef<DetailLaporan>[] = [
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
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge variant="success">{row.original.jenis}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "sumber",
        header: "Sumber",
        cell: ({ row }) => {
            const sumber = row.original.sumber
                .replace(/_/g, ' ') // Ganti underscore dengan spasi
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Kapitalisasi tiap kata

            return (
                <div className="capitalize">
                    {sumber}
                </div>
            );
        },
    },
    {
        accessorKey: "jumlah",
        header: "jumlah",
        cell: ({ row }) => (
            // console.log(row.original.jenis_pembayaran_id.nama_pembayaran),
            <div className=""><FormatRupiah value={Number(row.original.jumlah)} /></div>
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
    // {
    //     accessorKey: "selisih",
    //     header: "Selisih",
    //     cell: ({ row }) => {
    //         const saldoAwal = Number(row.original.saldo_awal);
    //         const saldoAkhir = Number(row.original.saldo_akhir);
    //         const selisih = saldoAwal - saldoAkhir;

    //         return (
    //             <div className='text-blue-500'>
    //                 <FormatRupiah value={selisih} />
    //             </div>
    //         );
    //     },
    // },
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

            const id = row.original.laporan_id;
            const sumber = row.original.sumber;


            return (
                <div className="flex">
                    <Link href={route("admin.bendahara.laporan.sumber.detail", { laporan: id, sumber: sumber })}>
                        <Button variant="default">Detail</Button>
                    </Link>
                </div>
            );
        },
    }


];
