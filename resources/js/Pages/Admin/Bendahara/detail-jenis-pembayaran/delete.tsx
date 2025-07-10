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
import { HonorSkripsi, User, DetailJenisPembayaran } from '@/types';

interface DetailJenisPembayaranProps {
    detail_jenis_pembayaran: DetailJenisPembayaran;
}

const Delete = ({ detail_jenis_pembayaran }: DetailJenisPembayaranProps) => {
    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        tugas: "",
        jumlah: "",
    })
    const DeleteHonorUjian = (id: number) => {
        destroy(route("admin.bendahara.detail-jenis-pembayaran.destroy", id), {
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
                            <span className="text-red-500"> {detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran} - {detail_jenis_pembayaran.jumlah}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteHonorUjian(detail_jenis_pembayaran.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
