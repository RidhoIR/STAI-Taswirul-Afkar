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
import { HonorPPL, HonorSkripsi, Jabatan, User } from '@/types';
import { FormatRupiah } from '@arismun/format-rupiah';

interface DeleteJabatanProps {
    jabatan: Jabatan;
}

const Delete = ({ jabatan }: DeleteJabatanProps) => {
    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
        name: "",
        honor: "",
    })
    const DeleteHonorPPL = (id: number) => {
        destroy(route("admin.bendahara.honor-jabatan.destroy", id), {
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
                            <span className="text-red-500"> {jabatan.name} - <FormatRupiah value={Number(jabatan.honor)} /></span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteHonorPPL(jabatan.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
