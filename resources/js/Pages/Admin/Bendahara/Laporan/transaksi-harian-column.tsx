// src/Components/columns.ts
import { jsPDF } from 'jspdf';
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Honorarium, HonorSkripsi, Mahasiswa, Transaksi, TransaksiHarian, User } from "@/types"; // Sesuaikan dengan tipe data Anda
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
// import Edit from '../edit';
// import Delete from '../delete';
// import Edit from './edit';
// import Delete from './delete';



// Definisikan kolom tabel produk
export const TransaksiHarianColumn: ColumnDef<TransaksiHarian>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "tanggal",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tanggal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("tanggal")}</div>,
    },
    {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.deskripsi}</div>
        ),
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => {
            const jenis = row.original.jenis;

            return (
                <span
                    className={`px-2 py-2 font-semibold capitalize  rounded-full ${jenis === 'pemasukan'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                >
                    {jenis}
                </span>
            );
        },
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => (
            <div className="capitalize">
                <FormatRupiah value={Number(row.original.jumlah)} />
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original.id;
            const transaksi_harian = row.original;

            return (
                <div className="flex gap-2">
                    {/* <Edit transaksiHarians={transaksi_harian} />
                    <Delete transaksiHarians={transaksi_harian} /> */}
                    {/* <Button variant="default" onClick={handleDownloadSlip}>
                        PDF
                    </Button> */}
                    {/* <Edit honor_skripsi={honor_skripsi} />
                    <Delete Honor_skripsi={honor_skripsi} /> */}
                </div>
            );
        },
    }


];
