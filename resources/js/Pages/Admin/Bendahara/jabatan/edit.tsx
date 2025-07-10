import React, { useEffect, useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { HonorSkripsi, HonorWisuda, Jabatan, PageProps } from '@/types';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '@/Components/ui/select';

interface JabatanProps {
    jabatan: Jabatan;
}

const daftarTugas = ["Panitia", "Penguji", "Sekretaris", "Pembimbing"];

const Edit = ({ jabatan }: JabatanProps) => {
    const [open, setOpen] = useState(false);
    const { semesters } = usePage<PageProps>().props;

    const { put, data, setData, processing, errors, reset } = useForm({
        name: jabatan.name,
        honor: jabatan.honor.toString(),
    });

    useEffect(() => {
        setData({
            name: jabatan.name,
            honor: jabatan.honor.toString(),
        });
    }, [jabatan]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.honor-jabatan.update", jabatan.id), {
            onSuccess: () => setOpen(false),
        });
    };

    const formatRupiah = (value: string) => {
        const numberString = value.replace(/[^,\d]/g, '');
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substring(0, sisa);
        const ribuan = split[0].substring(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('honor', value);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="blue">
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Honor Skripsi</DialogTitle>
                    <DialogDescription>Edit data honorarium skripsi.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama<span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="honor">Honor<span className="text-red-500">*</span></Label>
                            <Input
                                id="honor"
                                type="text"
                                value={formatRupiah(data.honor)}
                                onChange={handleJumlahChange}
                                required
                            />
                            {errors.honor && <p className="text-red-500">{errors.honor}</p>}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
