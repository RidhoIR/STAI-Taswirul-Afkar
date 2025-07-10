import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Honorarium, HonorPPL, HonorSkripsi, HonorWisuda, Mahasiswa, PageProps, Transaksi } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon, Download, File } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'



interface HonorWisudaProps {
    honor_wisuda: HonorWisuda[];
}

const Index = ({ honor_wisuda }: HonorWisudaProps) => {
    const [open, setOpen] = useState(false);

    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;


    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        tugas: '',
        honor_per_tugas: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.honor-wisuda.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
                console.log("Pembayaran berhasil");
            },
            onError: (errors) => {
                console.log(errors);
            }
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
        setData('honor_per_tugas', value); // Simpan nilai asli (hanya angka)
    };

    const [selectedTahun, setSelectedTahun] = useState<string>('all');


    const tahunList = Array.from(
        new Set(
            honor_wisuda
                .map(item => new Date(item.tanggal).getFullYear().toString())
        )
    ).sort((a, b) => parseInt(b) - parseInt(a)); // sort dari tahun terbaru

    const filteredData = selectedTahun === 'all'
        ? honor_wisuda
        : honor_wisuda.filter(
            (item) => new Date(item.tanggal).getFullYear().toString() === selectedTahun
        );


    return (
        <TestLayout>
            <Head title='Honor Wisuda' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Honorarium Wisuda
                                </h1>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        if (selectedTahun === 'all') {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Oops...',
                                                text: 'Silakan pilih tahun tertentu untuk mencetak laporan.',
                                                confirmButtonColor: '#3085d6',
                                            });
                                            return;
                                        }

                                        const url = route('admin.bendahara.honor-wisuda.laporan', {
                                            tahun: selectedTahun,
                                        });

                                        window.open(url, '_blank');
                                    }}
                                >
                                    <Download className='mr-2' /> Laporan PDF
                                </Button>
                                <Select
                                    value={selectedTahun}
                                    onValueChange={(value) => setSelectedTahun(value)}
                                >
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun</SelectItem>
                                        {tahunList.map((tahun, i) => (
                                            <SelectItem key={i} value={tahun}>
                                                {tahun}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Dialog open={open} onOpenChange={setOpen} >
                                    <DialogTrigger asChild>
                                        <Button variant="blue">
                                            <Download className='mr-2' />Tambah Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent >
                                        <DialogHeader>
                                            <DialogTitle>Tambah Data</DialogTitle>
                                            <DialogDescription>
                                                Silahkan Masukkan Data yang sesuai
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submit}>
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
                                </Dialog>
                            </div>
                        </div>
                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
            </div>

            <DataTable data={filteredData} columns={column} />
        </TestLayout >
    )
}

export default Index;
