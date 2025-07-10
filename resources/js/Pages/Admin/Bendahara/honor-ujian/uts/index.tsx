import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Honorarium, HonorProposal, HonorSkripsi, HonorSkripsiTugas, HonorUjian, Mahasiswa, PageProps, Transaksi } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './column';
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
import Swal from 'sweetalert2'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'



interface HonorUjianProps {
    honor_uts: HonorUjian[];
}

interface TugasItem {
    jenis_tugas: string;
    jumlah: number | string;
    honor_per_tugas: number | string;
    honor_total: number | string;
    [key: string]: string | number; // ✅ index signature agar bisa diakses dengan string
}

const Index = ({ honor_uts }: HonorUjianProps) => {
    const [open, setOpen] = useState(false);

    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;


    const { data, setData, post, processing, errors, reset } = useForm<{
        semester_id: string;
        nama: string;
        tanggal: string;
        tugas: TugasItem[];
    }>({
        semester_id: '',
        nama: '',
        tanggal: '',
        tugas: [
            {
                jenis_tugas: '',
                jumlah: '',
                honor_per_tugas: '',
                honor_total: '',
            },
        ],
    });


    const formatToRupiah = (value: string | number) => {
        const numberValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

        if (isNaN(numberValue)) return 'Rp. ';

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numberValue);
    };

    const parseRupiah = (str: string) => {
        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    };

    const handleTugasChange = (index: number, field: string, value: any) => {
        const updatedTugas = [...data.tugas];

        if (field === 'honor_per_tugas') {
            updatedTugas[index][field] = parseRupiah(value);
        } else if (field === 'jumlah') {
            updatedTugas[index][field] = parseInt(value);
        } else {
            updatedTugas[index][field] = value;
        }

        setData('tugas', updatedTugas);
    };
    const addTugas = () => {
        setData('tugas', [
            ...data.tugas,
            { jenis_tugas: '', jumlah: '', honor_per_tugas: '', honor_total: '' },
        ]);
    };

    const removeTugas = (index: number) => {
        const updated = data.tugas.filter((_, i) => i !== index);
        setData('tugas', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bendahara.honor-ujian.uts.store'), {
            onSuccess: () => {
                setOpen(false),
                    reset(),
                    setData({
                        semester_id: '',
                        nama: '',
                        tanggal: '',
                        tugas: [
                            {
                                jenis_tugas: '',
                                jumlah: '', // kosong agar tidak jadi 0 lagi
                                honor_per_tugas: '',
                                honor_total: '',
                            },
                        ],
                    })
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

    // const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
    //     setData('jumlah', value); // Simpan nilai asli (hanya angka)
    // };

    const daftarTugas = [
        "Panitia", "Penguji", "Sekretaris", "Pembimbing"
    ]

    // const toggleTugas = (tugasName: string) => {
    //     const updated = data.tugas.includes(tugasName)
    //         ? data.tugas.filter((item) => item !== tugasName)
    //         : [...data.tugas, tugasName];

    //     setData('tugas', updated);
    // };

    const [selectedSemester, setSelectedSemester] = useState<string>('all');


    const filteredData = selectedSemester === 'all'
        ? honor_uts
        : honor_uts.filter(
            (item) => item.semester.id.toString() === selectedSemester
        );


    return (
        <TestLayout>
            <Head title='Honor Ujian UTS' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Honorarium Ujian UTS
                                </h1>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        if (selectedSemester === 'all') {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Oops...',
                                                text: 'Silakan pilih semester tertentu untuk mencetak laporan.',
                                                confirmButtonColor: '#3085d6',
                                            });
                                            return;
                                        }

                                        const url = route('admin.bendahara.honor-ujian.laporan', {
                                            semester: selectedSemester,
                                            tipe_ujian: 'UTS'
                                        });

                                        window.open(url, '_blank');
                                    }}
                                >
                                    <Download className='mr-2' /> Laporan PDF
                                </Button>
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
                                <Dialog open={open} onOpenChange={setOpen} >
                                    <DialogTrigger asChild>
                                        <Button variant="blue">
                                            <Download className='mr-2' />Tambah Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='max-h-[90vh] overflow-y-auto'>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Data</DialogTitle>
                                            <DialogDescription>
                                                Silahkan Masukkan Data yang sesuai
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="space-y-4">
                                            <div>
                                                <Label>Nama</Label>
                                                <Input
                                                    value={data.nama}
                                                    onChange={(e) => setData('nama', e.target.value)}
                                                />
                                                {errors.nama && <p className="text-red-500">{errors.nama}</p>}
                                            </div>
                                            <div className='mb-4'>
                                                <Label htmlFor="semester_id">Semester</Label>
                                                <Select
                                                    value={data.semester_id}
                                                    onValueChange={(value) => setData('semester_id', value)}
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
                                            <div>
                                                <Label>Tanggal</Label>
                                                <Input
                                                    type="date"
                                                    value={data.tanggal}
                                                    onChange={(e) => setData('tanggal', e.target.value)}
                                                />
                                                {errors.tanggal && <p className="text-red-500">{errors.tanggal}</p>}
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-bold text-lg">Tugas</h3>
                                                {data.tugas.map((tugas, index) => (
                                                    <div key={index} className="border p-4 rounded space-y-2">
                                                        <div>
                                                            <Label>Jenis Tugas</Label>
                                                            <Select
                                                                value={tugas.jenis_tugas}
                                                                onValueChange={(value) =>
                                                                    handleTugasChange(index, 'jenis_tugas', value)
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Tugas" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="pembuat soal">Pembuat Soal</SelectItem>
                                                                    <SelectItem value="korektor">Korektor</SelectItem>
                                                                    <SelectItem value="pengawas">Pengawas</SelectItem>
                                                                    <SelectItem value="panitia">Panitia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {(tugas.jenis_tugas === 'pembuat soal' || tugas.jenis_tugas === 'korektor'  || tugas.jenis_tugas === 'pengawas') && (
                                                            <>
                                                                <div>
                                                                    <Label>Jumlah</Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={isNaN(Number(tugas.jumlah)) ? '' : tugas.jumlah}
                                                                        onChange={(e) =>
                                                                            handleTugasChange(index, 'jumlah', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    value={formatToRupiah(tugas.honor_per_tugas)}
                                                                    onChange={(e) =>
                                                                        handleTugasChange(index, 'honor_per_tugas', e.target.value)
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                        {(tugas.jenis_tugas === 'panitia') && (
                                                            <div>
                                                                <Label>Honor</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={formatToRupiah(tugas.honor_per_tugas)}
                                                                    onChange={(e) =>
                                                                        handleTugasChange(index, 'honor_per_tugas', e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => removeTugas(index)}
                                                        >
                                                            Hapus Tugas
                                                        </Button>
                                                    </div>
                                                ))}
                                                <div className='flex justify-between'>
                                                    <Button type="button" onClick={addTugas}>
                                                        Tambah Tugas
                                                    </Button>
                                                    <Button variant="blue" type="submit" disabled={processing}>
                                                        Simpan
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
                {/* <DataTable data={filteredData} columns={column} /> */}
            </div>
            <DataTable data={filteredData} columns={column} />
        </TestLayout >
    )
}

export default Index;
