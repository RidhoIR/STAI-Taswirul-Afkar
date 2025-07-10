import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Anggaran, PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface EditAnggaran {
    anggaran: Anggaran;
}

const Update = ({ anggaran }: EditAnggaran) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        status_anggaran: anggaran.status_anggaran,
        keterangan: anggaran.keterangan,
        jumlah_anggaran_disetujui: anggaran.jumlah_anggaran_disetujui,
        tgl_pencairan: anggaran.tgl_pencairan || "",
        status_pencairan: anggaran.status_pencairan,
        tgl_pengajuan: anggaran.tgl_pengajuan,
    });

    useEffect(() => {
        setData({
            ...data,
            status_anggaran: anggaran.status_anggaran,
            keterangan: anggaran.keterangan,
            jumlah_anggaran_disetujui: anggaran.jumlah_anggaran_disetujui,
            tgl_pencairan: anggaran.tgl_pencairan,
            status_pencairan: anggaran.status_pencairan,
            tgl_pengajuan: anggaran.tgl_pengajuan,
        });
    }, [anggaran]);
    const handleDateSelect = (field: any, date: any) => {
        if (date) {
            // Set the time to noon to avoid timezone issues
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({ ...data, [field]: adjustedDate.toISOString().split('T')[0] });
        } else {
            setData({ ...data, [field]: "" });
        }
    };




    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.anggaran.update", anggaran.id), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: () => {
                // Handle errors here, or use error props if available.
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Edit Anggaran</DialogTitle>
                <DialogDescription>
                    Edit Rekap. Klik Simpan jika sudah selesai.
                </DialogDescription>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="tgl_pengajuan">Tanggal Pengajuan</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.tgl_pengajuan &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {data.tgl_pengajuan
                                            ? format(
                                                new Date(data.tgl_pengajuan),
                                                "yyyy-MM-dd"
                                            )
                                            : "Pilih Tanggal"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.tgl_pengajuan
                                                ? new Date(data.tgl_pengajuan)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateSelect("tgl_pengajuan", date)
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
};

export default Update;
