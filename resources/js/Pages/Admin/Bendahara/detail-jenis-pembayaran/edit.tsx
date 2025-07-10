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
} from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { DetailJenisPembayaran, HonorSkripsi, HonorUjian, PageProps, User } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface DetailJenisPembayaranProps {
    detail_jenis_pembayaran: DetailJenisPembayaran;
}

const Edit = ({ detail_jenis_pembayaran }: DetailJenisPembayaranProps) => {
    const { semesters } = usePage<PageProps>().props
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        jumlah: detail_jenis_pembayaran.jumlah.toString(),
    });

    useEffect(() => {
        setData({
            jumlah: detail_jenis_pembayaran.jumlah.toString(),
        });
    }, [detail_jenis_pembayaran]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.detail-jenis-pembayaran.update", detail_jenis_pembayaran.id), {
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
                        <DialogTitle>Edit Data</DialogTitle>
                        <DialogDescription>
                            Make changes to the your information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
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
