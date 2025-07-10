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
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { TransaksiHarian, User } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface EditTransaksiHarianProps {
    transaksiHarians: TransaksiHarian;
}

const Edit = ({ transaksiHarians }: EditTransaksiHarianProps) => {
    const formatDate = (dateStr: string | Date) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        deskripsi: transaksiHarians.deskripsi,
        tanggal:  formatDate(transaksiHarians.tanggal),
        jumlah: transaksiHarians.jumlah.toString(),
        jenis: transaksiHarians.jenis,
    });

    useEffect(() => {
        setData({
            deskripsi: transaksiHarians.deskripsi,
            tanggal: formatDate(transaksiHarians.tanggal),
            jumlah: transaksiHarians.jumlah.toString(),
            jenis: transaksiHarians.jenis,
        });
    }, [transaksiHarians]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.transaksi-harian.update", transaksiHarians.id), {
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

    const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('jumlah', value); // Simpan nilai asli (hanya angka)
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
                        <div className="space-y-4">
                            <div className='mb-4'>
                                <Label htmlFor='deskripsi'>Deskripsi<span className='text-red-500'>*</span></Label>
                                <Input
                                    id='deskripsi'
                                    type='text'
                                    value={data.deskripsi} // Tampilkan nilai terformat dengan awalan Rp
                                    onChange={(e) => setData('deskripsi', e.target.value)} // Tangani perubahan input
                                    required
                                />
                                {errors.deskripsi && <p className='text-red-500'>{errors.deskripsi}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='jenis'>Jenis<span className='text-red-500'>*</span></Label>
                                <Input
                                    id='jenis'
                                    type='text'
                                    value={data.jenis} // Tampilkan nilai terformat dengan awalan Rp
                                    onChange={(e) => setData('jenis', e.target.value)} // Tangani perubahan input
                                    readOnly
                                />
                                {errors.jenis && <p className='text-red-500'>{errors.jenis}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='tanggal'>Tanggal<span className='text-red-500'>*</span></Label>
                                <Input
                                    id='tanggal'
                                    type='date'
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    required
                                />
                                {errors.tanggal && <p className='text-red-500'>{errors.tanggal}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='jumlah'>Jumlah<span className='text-red-500'>*</span></Label>
                                <Input
                                    id='jumlah'
                                    type='text'
                                    value={formatRupiah(data.jumlah)}
                                    onChange={handleJumlahChange} // Tangani perubahan input
                                    required
                                />
                                {errors.jumlah && <p className='text-red-500'>{errors.jumlah}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </div>

                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
