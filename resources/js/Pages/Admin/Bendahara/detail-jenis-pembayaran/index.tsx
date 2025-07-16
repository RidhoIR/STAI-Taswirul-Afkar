import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Jenis_pembayaran, DetailJenisPembayaran, Mahasiswa, PageProps } from '@/types'
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
import { se } from 'date-fns/locale'
import { Card, CardContent } from '@/Components/ui/card'


interface JenisPembayaranSemesterProps {
    jenis_pembayaran_semester: DetailJenisPembayaran[];
}

const Index = ({ jenis_pembayaran_semester }: JenisPembayaranSemesterProps) => {
    const { flash } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;

    const { data, setData, post, reset, errors, processing } = useForm({
        jenis_pembayaran_id: '',
        semester_id: '',
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
        reset();
        post(route('admin.bendahara.detail-jenis-pembayaran.store'));
    };

    const [selectedSemester, setSelectedSemester] = useState<string>('all');

    const selectedJenis = jenis_pembayaran.find(jp => jp.id.toString() === data.jenis_pembayaran_id);
    const isOnce = selectedJenis?.is_once;

    const filteredData = selectedSemester === 'all'
        ? jenis_pembayaran_semester
        : jenis_pembayaran_semester.filter(
            (item) => item.semester?.id?.toString() === selectedSemester
        );

    return (
        <TestLayout>
            <Head title='Detail Jenis Pembayaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className='flex md:justify-between flex-col md:flex-row mb-2'>
                            <div>
                                <h1 className='md:text-3xl text-xl font-sans font-bold'>Detail Jenis Pembayaran</h1>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Select
                                    value={selectedSemester}
                                    onValueChange={(value) => setSelectedSemester(value)}
                                >
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Pilih Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Semester</SelectItem>
                                        {semesters.map((semester, i) => (
                                            <SelectItem key={i} value={semester.id.toString()}>
                                                {semester.semester} {semester.tahun_ajaran}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="blue" size="default">
                                            <BsPersonAdd size={20} className='mr-2' /> Tambah Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Data</DialogTitle>
                                            <DialogDescription>
                                                Make changes to the user's information.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submit}>
                                            <div className="space-y-4">
                                                <div className='mb-4'>
                                                    <Label htmlFor="jenis_pembayaran_id">Jenis Pembayaran<span className='text-red-600'>*</span></Label>
                                                    <Select
                                                        value={data.jenis_pembayaran_id}
                                                        onValueChange={(value) => setData('jenis_pembayaran_id', value)}
                                                        required
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
                                                {!isOnce && (
                                                    <div className='mb-4'>
                                                        <Label htmlFor="semester_id">Semester<span className='text-red-600'>*</span></Label>
                                                        <Select
                                                            value={data.semester_id}
                                                            onValueChange={(value) => setData('semester_id', value)}
                                                            required
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Semester" />
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
                                                )}
                                                <div>
                                                    <Label htmlFor="jumlah">Jumlah<span className='text-red-600'>*</span></Label>
                                                    <Input
                                                        id="jumlah"
                                                        value={formatRupiah(data.jumlah)}
                                                        onChange={handleJumlahChange}
                                                        required
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
                        </div>

                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
            </div>
            <DataTable data={filteredData} columns={column} />
        </TestLayout>
    )
}

export default Index;
