import React, { useEffect, useState } from 'react';
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Honorarium, PageProps, Semester, User } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface EditUserProps {
    honorarium: Honorarium;
}

const Edit = ({ honorarium }: EditUserProps) => {
    const [open, setOpen] = useState(false);
    const { jabatan } = usePage<PageProps>().props;
    const formatDateToMonthString = (date: Date) => {
        const year = new Date(date).getFullYear();
        const dateObject = new Date(date);
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    };

    const { put, data, setData, processing, errors, reset } = useForm({
        name: honorarium.name ?? '',
        jabatan_id: honorarium.jabatan?.id?.toString() ?? '',
        jumlah: honorarium.jumlah ?? 0,
        periode: honorarium.periode
            ? formatDateToMonthString(honorarium.periode)
            : '',
        jumlah_mk: honorarium.jumlah_mk?.toString() ?? '',
        honor_mk: honorarium.honor_mk?.toString() ?? '',
        lain_lain: honorarium.lain_lain?.toString() ?? '',
    });

    useEffect(() => {
        setData({
            name: honorarium.name ?? '',
            jabatan_id: honorarium.jabatan?.id?.toString() ?? '',
            jumlah: honorarium.jumlah ?? 0,
            periode: honorarium.periode
                ? formatDateToMonthString(honorarium.periode)
                : '',
            jumlah_mk: honorarium.jumlah_mk?.toString() ?? '',
            honor_mk: honorarium.honor_mk?.toString() ?? '',
            lain_lain: honorarium.lain_lain?.toString() ?? '',
        });
    }, [honorarium]);


    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.honorarium.update", honorarium.id), {
            onSuccess: () => setOpen(false),
        });
    };

    const formatRupiah = (value: string) => {
        const numberString = value.replace(/[^,\d]/g, '').toString(); // Hapus semua karakter non-digit
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return rupiah ? `Rp. ${rupiah}` : 'Rp. '; // Tambahkan awalan Rp.
    };

    const handleHonorMKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('honor_mk', value); // Simpan nilai asli (hanya angka)
    };

    const handleLain_LainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('lain_lain', value); // Simpan nilai asli (hanya angka)
    };

    return (
        <div>
            {/* Dialog and form for editing user */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="blue">
                        <BsPencilSquare />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className='mb-4'>
                            <Label htmlFor='name'>Nama<span className='text-red-500'>*</span></Label>
                            <Input
                                id='name'
                                type='text'
                                value={data.name} // Tampilkan nilai terformat dengan awalan Rp
                                onChange={(e) => setData('name', e.target.value)} // Tangani perubahan input
                                required
                            />
                            {errors.name && <p className='text-red-500'>{errors.name}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="jabatan_id">Jabatan <span className='text-gray-600'>(opsional)</span></Label>
                            <Select
                                value={data.jabatan_id}
                                onValueChange={(value) => setData('jabatan_id', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jabatan.map((jabatan, i) => (
                                        <SelectItem key={i} value={jabatan.id.toString()}>
                                            {jabatan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.jabatan_id && <p className="text-red-600">{errors.jabatan_id}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor='periode'>Periode<span className='text-red-500'>*</span></Label>
                            <Input
                                id='periode'
                                type='month'
                                value={data.periode} // Tampilkan nilai terformat dengan awalan Rp
                                onChange={(e) => setData('periode', e.target.value)} // Tangani perubahan input
                                required
                            />
                            {errors.periode && <p className='text-red-500'>{errors.periode}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor='jumlah_mk'>Jumlah MK <span className='text-gray-600'>(opsional)</span></Label>
                            <Input
                                id='jumlah_mk'
                                type='number'
                                value={data.jumlah_mk} // Tampilkan nilai terformat dengan awalan Rp
                                onChange={(e) => setData('jumlah_mk', e.target.value)} // Tangani perubahan input

                            />
                            {errors.jumlah_mk && <p className='text-red-500'>{errors.jumlah_mk}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor='honor_mk'>Honor <span className='text-red-500'>*</span></Label>
                            <Input
                                id='honor_mk'
                                type='text'
                                value={formatRupiah(data.honor_mk)} // Tampilkan nilai terformat dengan awalan Rp
                                onChange={handleHonorMKChange} // Tangani perubahan input
                                required
                            />
                            {errors.honor_mk && <p className='text-red-500'>{errors.honor_mk}</p>}
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor='lain_lain'>Lain-lain <span className='text-gray-600'>(opsional)</span></Label>
                            <Input
                                id='lain_lain'
                                type='text'
                                value={formatRupiah(data.lain_lain)}
                                onChange={handleLain_LainChange}
                            />
                            {errors.lain_lain && <p className='text-red-500'>{errors.lain_lain}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Ajukan
                            </Button>
                            <Button type='button' variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
