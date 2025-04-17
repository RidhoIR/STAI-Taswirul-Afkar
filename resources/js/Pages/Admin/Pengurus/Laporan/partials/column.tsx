
import { ColumnDef } from "@tanstack/react-table";
import { Anggaran, Lpj, User } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown, CheckCheckIcon, CheckCircle, CheckIcon, CheckSquareIcon } from "lucide-react";
import { BsCloudDownload, BsDownload, BsFileArrowDown, BsFileArrowDownFill, BsFileBarGraph, BsFillCloudDownloadFill } from "react-icons/bs";
import { IconCheck, IconFileDownload, IconFileDownloadFill } from "@irsyadadl/paranoid";
import { FaFontAwesome } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileDownload, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useForm } from "@inertiajs/react";

// import EditLpj from "../edit";
// import Edit from "../edit";
// import Edit from "../edit";

// import Delete from "../delete";
// import Edit from "../edit";
// import create from "../create"


// Definisikan kolom tabel produk
export const column: ColumnDef<Lpj>[] = [
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
        accessorKey: "id_anggaran",
        header: "anggaran",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.anggaran.perihal}</div>
        ),
    },
    {
        accessorKey: "anggaran.user.name",
        header: "Nama User",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.anggaran.user.name}</div>
        ),
    },
    {
        accessorKey: "file_laporan",
        header: "File Laporan",
        cell: ({ row }) => {
            const fileName = row.getValue("file_laporan") as string; // Assuming this is the file name
            const fileUrl = route('pengurus.anggaran.download', { file: fileName }); // URL to download the file

            return (
                <div className="flex items-center">
                    <a href={fileUrl} download className="ml-2 text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faDownload} className="fa-fw text-2xl" />
                    </a>
                </div>
            );
        }
    },
    {
        accessorKey: "foto_dokumentasi",
        header: "Foto Dokumentasi",
        cell: ({ row }) => {
            const fotoDokumentasi = row.getValue("foto_dokumentasi") as string; // Get the filename of the image
            const imageUrl = `/storage/${fotoDokumentasi}`; // Adjust this path to match where your images are stored

            return (
                <div className="capitalize">
                    {fotoDokumentasi ? (
                        <img
                            src={imageUrl}
                            alt="Foto Dokumentasi"
                            className="w-16 h-16 object-cover rounded"
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "tgl_pengajuan",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tgl. Pengajuan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("tgl_pengajuan")}</div>,
    },
    {
        accessorKey: "tgl_diterima",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tgl. diterima
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("tgl_diterima")}</div>,
    },
    {
        accessorKey: "narasi",
        header: "Narasi",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("narasi")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const laporan = row.original;
    
            // Initialize the form
            const { post } = useForm();
    
            const handleCheck = () => {
                post(route('admin.lpj.update', laporan.id), {
                    onSuccess: () => {
                    },
                });
            };
    
            return (
                <div className="flex gap-2">
                    <Button onClick={handleCheck} variant="green" aria-label="Mark as Received">
                        <CheckIcon className="h-10 w-10" />
                    </Button>
                </div>
            );
        },
    }

];
