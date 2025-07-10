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
import { useForm } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Jenis_pembayaran } from '@/types';

interface JenisPembayaranProps {
    jenis_pembayaran: Jenis_pembayaran;
}

function formatRupiah(angka: string, prefix = 'Rp. ') {
    let number_string = angka.replace(/[^,\d]/g, '').toString();
    let split = number_string.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    // Mengabaikan desimal jika tidak ada angka setelah koma
    if (split[1] && split[1] === '00') {
        return prefix + rupiah; // Tanpa bagian desimal
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix + rupiah;
}

// Fungsi untuk menghapus simbol Rupiah saat di-submit
const cleanRupiah = (value: string) => {
    return value.replace(/[^0-9]/g, ''); // Menghapus simbol Rupiah dan karakter non-angka
};

const Edit = ({ jenis_pembayaran }: JenisPembayaranProps) => {
    const [open, setOpen] = useState(false);

    // Inisialisasi form dengan data
    const { put, data, setData, processing, errors } = useForm({
        nama_pembayaran: jenis_pembayaran.nama_pembayaran,
        is_once: jenis_pembayaran.is_once ?? false,
    });

    const formatRupiah = (value: string) => {
        let numberString = value.replace(/\D/g, '');
        let rupiah = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    // Handling jumlah anggaran input change

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Kirim data ke backend dengan nilai jumlah yang telah dibersihkan
        put(route("admin.bendahara.jenis-pembayaran.update", jenis_pembayaran.id), {
            data: {
                nama_pembayaran: data.nama_pembayaran,
            },
            onSuccess: () => setOpen(false),
        });
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
                    <DialogTitle>Edit Jenis Pembayaran</DialogTitle>
                    <DialogDescription>
                        Ubah data pembayaran di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="nama_pembayaran">Nama Pembayaran</Label>
                            <Input
                                id="nama_pembayaran"
                                value={data.nama_pembayaran}
                                onChange={e => setData('nama_pembayaran', e.target.value)}
                            />
                            {errors.nama_pembayaran && <p className="text-red-600 text-sm">{errors.nama_pembayaran}</p>}
                        </div>
                        <div>
                            <Label htmlFor="is_once" className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_once"
                                    checked={data.is_once ?? false}
                                    onChange={e => setData('is_once', e.target.checked)}
                                    className="mr-2"
                                />
                                <span>Hanya Sekali Bayar?</span>
                            </Label>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;