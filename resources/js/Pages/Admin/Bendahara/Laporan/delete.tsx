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
import { Laporan, User } from '@/types';
import { useState } from "react";

export default function Delete({ laporan }: { laporan: Laporan }) {
    const { delete: destroy, reset, data, setData, post, processing } = useForm({
        id: laporan.id,
    });
    const [open, setOpen] = useState(false);

    const destroyLaporan = (id: number) => {
        destroy(route("admin.bendahara.laporan.destroy", id), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="danger" className="flex items-center gap-1" type="button">
                    <FaTrash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    Hapus Laporan
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Yakin ingin menghapus laporan ini?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => destroyLaporan(laporan.id)} >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
