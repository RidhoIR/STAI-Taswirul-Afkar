import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps, Transaksi } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import { cn } from "@/lib/utils"
// import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Card, CardContent } from '@/Components/ui/card'
import ComboboxMahasiswa from './partials/combobox'
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import ComboboxInput from '@/Components/ComboboxInput'
import { DialogDescription } from '@radix-ui/react-dialog'
import { CommandCombobox } from '@/Components/CommandCombobox'

interface AnggaranProps {
    anggarans: Anggaran[];
    filterYear: string;
    filterTridharma: string | null;
    availableYears: number[];
    tridharmas: { id: number; nama: string }[];
}

interface TransaksiProps {
    transaksi: Transaksi[];
   
}

const Index = ({ transaksi, }: TransaksiProps) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;


    const { data, setData, post, processing, errors } = useForm({
        mahasiswa_id: '',
        jenis_pembayaran_id: '',
        semester_id: '',
        jumlah: '',
        deskripsi: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.transaksi.store', data.mahasiswa_id), {
            onSuccess: () => {
                setOpen(false);
                console.log("Pembayaran berhasil");
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    const optionsMahasiswa = (mahasiswa ?? []).map((mhs: Mahasiswa) => ({
        label: mhs.name,
        value: mhs.id.toString(),
    }));

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
        <TestLayout>
            <Head title='Riwayat Pembayaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Riwayat Pembayaran
                                </h1>
                            </div>
                            {/* <Dialog open={open} onOpenChange={setOpen} modal={false}>
                                <DialogTrigger asChild>
                                    <Button variant="blue">
                                        <Download className='mr-2' />Tambah Pembayaran
                                    </Button>
                                </DialogTrigger>
                                <DialogContent >
                                    <DialogHeader>
                                        <DialogTitle>Tambah Pembayaran</DialogTitle>
                                        <DialogDescription>
                                            Masukkan data pembayaran
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={submit}>
                                        <div className='mb-4'>
                                            <Label htmlFor="mahasiswa_id">Mahasiswa</Label>
                                            <CommandCombobox
                                                value={data.mahasiswa_id}
                                                onValueChange={(value) => setData('mahasiswa_id', value)}
                                                options={optionsMahasiswa} />
                                            {errors.mahasiswa_id && <p className="text-red-600">{errors.mahasiswa_id}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor="jenis_pembayaran_id">Jenis Pembayaran</Label>
                                            <Select
                                                value={data.jenis_pembayaran_id}
                                                onValueChange={(value) => setData('jenis_pembayaran_id', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih jenis pembayaran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {jenis_pembayaran.map((jenis_pembayaran, i) => (
                                                        <SelectItem key={i} value={jenis_pembayaran.id.toString()}>
                                                            {jenis_pembayaran.nama_pembayaran}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_pembayaran_id && <p className="text-red-600">{errors.jenis_pembayaran_id}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor="semester_id">Semester</Label>
                                            <Select
                                                value={data.semester_id}
                                                onValueChange={(value) => setData('semester_id', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih jenis pembayaran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {semesters.map((semester, i) => (
                                                        <SelectItem key={i} value={semester.id.toString()}>
                                                            {semester.semester} {semester.tahun_ajaran}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.semester_id && <p className="text-red-600">{errors.semester_id}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor='deskripsi'>Deskripsi</Label>
                                            <Input
                                                id='deskripsi'
                                                type='text'
                                                value={data.deskripsi}
                                                onChange={(e) => setData('deskripsi', e.target.value)}
                                            />
                                            {errors.deskripsi && <p className='text-red-500'>{errors.deskripsi}</p>}
                                        </div>

                                        <div className='mb-4'>
                                            <Label htmlFor='jumlah'>Jumlah</Label>
                                            <Input
                                                id='jumlah'
                                                type='text'
                                                value={formatRupiah(data.jumlah)} // Tampilkan nilai terformat dengan awalan Rp
                                                onChange={handleJumlahChange} // Tangani perubahan input
                                                required
                                            />
                                            {errors.jumlah && <p className='text-red-500'>{errors.jumlah}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                Ajukan
                                            </Button>
                                            <Button variant="outline" onClick={() => setOpen(false)}>
                                                Batal
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog> */}
                        </div>
                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
            </div>
            <DataTable data={transaksi} columns={column} />
        </TestLayout>
    )
}

export default Index;
