import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Jenis_pembayaran, JenisPembayaranSemester, Mahasiswa, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormatRupiah } from '@arismun/format-rupiah'


interface JenisPembayaranSemesterProps {
    jenis_pembayaran_semester: JenisPembayaranSemester[];
}

const Index = ({ jenis_pembayaran_semester }: JenisPembayaranSemesterProps) => {
    const { flash } = usePage<PageProps>().props;

    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
        nama_pembayaran: '',
        jumlah: '',
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
        setOpen(false);
        post(route('admin.bendahara.jenis-pembayaran.store'));
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
                                        <Label htmlFor="nama_pembayaran">Nama Pembayaran</Label>
                                        <Input
                                            id="nama_pembayaran"
                                            value={data.nama_pembayaran}
                                            onChange={e => setData('nama_pembayaran', e.target.value)}
                                        />
                                        {errors.nama_pembayaran && <p className="text-red-600">{errors.nama_pembayaran}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="jumlah">Jumlah</Label>
                                        <Input
                                            id="jumlah"
                                            value={formatRupiah(data.jumlah)}
                                            onChange={handleJumlahChange}
                                        />
                                        {errors.jumlah && <p className="text-red-600">{errors.jumlah}</p>}
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
            <DataTable data={jenis_pembayaran_semester} columns={column} />
        </TestLayout>
    )
}

export default Index;
