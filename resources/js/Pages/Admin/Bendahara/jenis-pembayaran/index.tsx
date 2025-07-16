import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Jenis_pembayaran, Mahasiswa, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill, BsPersonAdd } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
// import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { FormatRupiah } from '@arismun/format-rupiah'

interface AnggaranProps {
    anggarans: Anggaran[];
    filterYear: string;
    filterTridharma: string | null;
    availableYears: number[];
    tridharmas: { id: number; nama: string }[];
}

interface JenisPembayaranProps {
    jenis_pembayaran: Jenis_pembayaran[];
}

const Index = ({ jenis_pembayaran }: JenisPembayaranProps) => {
    const { flash } = usePage<PageProps>().props;

    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
        nama_pembayaran: '',
        jumlah: '',
        is_once: false,
    });

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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bendahara.jenis-pembayaran.store'),{
            onSuccess: () => {
                setOpen(false);
                console.log("Pembayaran berhasil");
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };


    return (
        <TestLayout>
            <Head title='Jenis Pembayaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <div className='flex md:justify-between flex-col md:flex-row mb-4'>
                    <h1 className='md:text-5xl text-xl font-sans font-bold'>Jenis Pembayaran</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="blue" size="default">
                                <BsPersonAdd size={20} className='mr-2' /> Tambah Data
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
                                    <div>
                                        <Label htmlFor="nama_pembayaran">Nama Pembayaran<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="nama_pembayaran"
                                            value={data.nama_pembayaran}
                                            onChange={e => setData('nama_pembayaran', e.target.value)}
                                            required
                                        />
                                        {errors.nama_pembayaran && <p className="text-red-600">{errors.nama_pembayaran}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="is_once">Hanya Sekali Bayar?</Label>
                                        <input
                                            id="is_once"
                                            type="checkbox"
                                            checked={data.is_once}
                                            onChange={e => setData('is_once', e.target.checked)}
                                            className="ml-2"
                                        />
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
                <hr className='border-t-2 border-gray-400' />
            </div>
            <DataTable data={jenis_pembayaran} columns={column} />
        </TestLayout>
    )
}

export default Index;
