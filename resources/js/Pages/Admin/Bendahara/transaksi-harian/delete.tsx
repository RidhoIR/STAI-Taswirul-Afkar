import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import { useForm } from '@inertiajs/react'
import { FaTrash } from "react-icons/fa";
import { HonorSkripsi, TransaksiHarian, User } from '@/types';
import { FormatRupiah } from '@arismun/format-rupiah';

interface DeleteTransaksiHarian {
    transaksiHarians: TransaksiHarian;
}

const Delete = ({ transaksiHarians }: DeleteTransaksiHarian) => {
    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
        deskripsi: "",
        jenis: "",
        jumlah: "",
        tanggal: "",
    })
    const DeleteHonorSkripsi = (id: number) => {
        destroy(route("admin.bendahara.transaksi-harian.destroy", id), {
            onSuccess: () => reset(),
        });
    }


    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="red">
                        <FaTrash />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete it permanently?
                            <span className="text-red-500"> {transaksiHarians.deskripsi} - {transaksiHarians.jenis} dengan jumlah
                                <span> <FormatRupiah value={Number(transaksiHarians.jumlah)} /></span>
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteHonorSkripsi(transaksiHarians.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
