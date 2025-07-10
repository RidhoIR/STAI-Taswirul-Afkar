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
import { HonorPPL, HonorSkripsi, HonorWisuda, User } from '@/types';

interface DeleteHonorWisudaProps {
    honor_wisuda: HonorWisuda;
}

const Delete = ({ honor_wisuda }: DeleteHonorWisudaProps) => {
    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        tugas: "",
        jumlah: "",
    })
    const DeleteHonorPPL = (id: number) => {
        destroy(route("admin.bendahara.honor-wisuda.destroy", id), {
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
                            <span className="text-red-500"> {honor_wisuda.nama} - {honor_wisuda.tugas}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteHonorPPL(honor_wisuda.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
