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
import { HonorSkripsi, HonorUjian } from '@/types';

interface DeleteHonorUjianProps {
    honor_ujian: HonorUjian;
}

const Delete = ({ honor_ujian }: DeleteHonorUjianProps) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route("admin.bendahara.honor-ujian.destroy", honor_ujian.id));
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
                            {honor_ujian.nama}
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
