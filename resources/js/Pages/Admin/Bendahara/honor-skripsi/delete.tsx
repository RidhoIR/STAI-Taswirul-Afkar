import React from 'react';
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
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from '@inertiajs/react';
import { FaTrash } from "react-icons/fa";
import { HonorSkripsi } from '@/types';

interface DeleteHonorSkripsiProps {
    Honor_skripsi: HonorSkripsi;
}

const Delete = ({ Honor_skripsi }: DeleteHonorSkripsiProps) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route("admin.bendahara.honor-skripsi.destroy", Honor_skripsi.id));
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <FaTrash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus data honor skripsi berikut secara permanen?
                        <br />
                        <span className="text-red-500 font-semibold block mt-2">
                            {Honor_skripsi.nama}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={processing}>
                        Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Delete;
