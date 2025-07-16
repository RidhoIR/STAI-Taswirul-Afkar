import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Honorarium, Mahasiswa, PageProps, Transaksi } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';





interface HonorariumProps {
    honorariums: Honorarium[];
}

const Index = ({ honorariums }: HonorariumProps) => {
    const [open, setOpen] = useState(false);
    const [copyOpen, setCopyOpen] = useState(false);
    // const [tambahOpen, setTambahOpen] = useState(false);
    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;
    const { jabatan } = usePage<PageProps>().props;



    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        jabatan_id: '',
        jumlah: '',
        periode: '',
        jumlah_mk: '',
        honor_mk: '',
        lain_lain: '',
    });

    const submitCopy = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bendahara.honorarium.copy'));
        setCopyOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.honorarium.store'), {
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

    const handleHonorMKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('honor_mk', value); // Simpan nilai asli (hanya angka)
    };

    const handleLain_LainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('lain_lain', value); // Simpan nilai asli (hanya angka)
    };

    const [filterPeriode, setFilterPeriode] = useState('');
    const filteredHonorariums = honorariums.filter((item) =>
        filterPeriode === '' || format(new Date(item.periode), 'yyyy-MM') === filterPeriode
    );



    return (
        <TestLayout>
            <Head title='Riwayat Pembayaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Honorarium
                                </h1>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        if (!filterPeriode) {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Oops...',
                                                text: 'Silakan pilih periode terlebih dahulu.',
                                                confirmButtonColor: '#3085d6',
                                            });
                                            return;
                                        }

                                        const url = route('admin.bendahara.honorarium.pdf', {
                                            periode: filterPeriode,
                                        });

                                        window.open(url, '_blank');
                                    }}
                                >
                                    <Download className='mr-2' /> Laporan PDF
                                </Button>
                                <Dialog open={copyOpen} onOpenChange={setCopyOpen} >
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Download className='mr-2' />Salin Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent >
                                        <DialogHeader>
                                            <DialogTitle>Salin Data</DialogTitle>
                                            <DialogDescription>
                                                Silahkan inputkan bulan yang ingin ditambahkan dengan menyalin data dari bulan sebelumnya
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submitCopy}>
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
                                            <DialogFooter>
                                                <Button type="submit" disabled={processing}>
                                                    Ajukan
                                                </Button>
                                                <Button type='button' variant="outline" onClick={() => setCopyOpen(false)}>
                                                    Batal
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={open} onOpenChange={setOpen} >
                                    <DialogTrigger asChild>
                                        <Button variant="blue">
                                            <Download className='mr-2' />Tambah Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='max-h-[90vh] overflow-y-auto'>
                                        <DialogHeader>
                                            <DialogTitle>Honorarium</DialogTitle>
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
                        </div>
                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
            </div>
            {/* <div className="flex flex-row mt-4  w-full gap-4 items-end "> */}
            <div className="flex items-center gap-2 mt-4">
                <Label htmlFor="filter-periode">Filter Periode:</Label>
                <Input
                    id="filter-periode"
                    type="month"
                    value={filterPeriode}
                    onChange={(e) => setFilterPeriode(e.target.value)}
                    className="max-w-[200px]"
                />
                <Button variant="outline" onClick={() => setFilterPeriode('')}>Reset</Button>
                {/* </div> */}
            </div>
            <DataTable data={filteredHonorariums} columns={column} />
        </TestLayout >
    )
}

export default Index;
