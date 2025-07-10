import React, { useEffect, useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { HonorSkripsi, HonorWisuda, PageProps } from '@/types';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '@/Components/ui/select';

interface HonorWisudaProps {
    honor_wisuda: HonorWisuda;
}


const Edit = ({ honor_wisuda }: HonorWisudaProps) => {
    const [open, setOpen] = useState(false);
    const { semesters } = usePage<PageProps>().props;

    const { put, data, setData, processing, errors, reset } = useForm({
        nama: honor_wisuda.nama,
        tugas: honor_wisuda.tugas,
        honor_per_tugas: honor_wisuda.honor_per_tugas.toString(),
    });

    useEffect(() => {
        setData({
            nama: honor_wisuda.nama,
            tugas: honor_wisuda.tugas,
            honor_per_tugas: honor_wisuda.honor_per_tugas.toString(),
        });
    }, [honor_wisuda]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.honor-wisuda.update", honor_wisuda.id), {
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
        setData('honor_per_tugas', value);
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
                        <div className='mb-4'>
                            <Label htmlFor='nama'>Nama<span className='text-red-500'>*</span></Label>
                            <Input
                                id='nama'
                                type='text'
                                value={data.nama} // Tampilkan nilai terformat dengan awalan Rp
                                onChange={(e) => setData('nama', e.target.value)} // Tangani perubahan input
                                required
                            />
                            {errors.nama && <p className='text-red-500'>{errors.nama}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label>Tugas</Label>
                            <Select
                                value={data.tugas}
                                onValueChange={(value) => setData('tugas', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Tugas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="panitia">Panitia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor='honor_per_tugas'>Honor<span className='text-red-500'>*</span></Label>
                            <Input
                                id='honor_per_tugas'
                                type='text'
                                value={formatRupiah(data.honor_per_tugas)}
                                onChange={handleJumlahChange} // Tangani perubahan input
                                required
                            />
                            {errors.honor_per_tugas && <p className='text-red-500'>{errors.honor_per_tugas}</p>}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
