import AdminLayout from '@/Layouts/AdminLayout'
import { Anggaran, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { BsFilePlus } from 'react-icons/bs';
import { IconFile, IconFileFill } from '@irsyadadl/paranoid';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import TestLayout from '@/Layouts/TestLayout';

interface AnggaranProps {
    anggarans: Anggaran[];
    filterYear: string;
    filterTridharma: string | null;
    availableYears: number[];
    tridharmas: { id: number; nama: string }[];
}

const Index = ({ anggarans, filterYear, filterTridharma, tridharmas }: AnggaranProps) => {
    const flash = usePage<PageProps>().props.flash;
    // const { tridharmas } = usePage<PageProps>().props;
    const [selectedYear, setSelectedYear] = useState(filterYear);
    const [selectedTridharma, setSelectedTridharma] = useState(filterTridharma || '');

    console.log(flash.success);
    console.log(anggarans);

    const [open, setOpen] = useState(false);

    const handleFilter = () => {
        const query = new URLSearchParams({
            year: selectedYear,
            ...(selectedTridharma !== "all" && { tridharma_id: selectedTridharma }) //menggunakan spread operator
        }).toString();
        window.location.href = route('pengurus.anggaran.index') + '?' + query;
    };

    // Fungsi untuk memformat nilai menjadi Rupiah dengan awalan Rp
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

    // Update anggaran to be either File or null
    const { data, setData, post, errors, processing } = useForm<{
        perihal: string;
        anggaran: File | null;
        jumlah_anggaran: string;
        tridharma_id: string;
    }>({
        tridharma_id: "",
        perihal: "",
        anggaran: null,
        jumlah_anggaran: "",
    });

    const handleJumlahAnggaranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('jumlah_anggaran', value); // Simpan nilai asli (hanya angka)
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.anggaran) {
            alert('File anggaran harus diunggah.');
            return;
        }

        post(route('pengurus.anggaran.store'), {
            onSuccess: () => setOpen(false),
        });
    };



    const handleDateSelect = (field: any, date: any) => {
        if (date) {
            // Set the time to noon to avoid timezone issues
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({ ...data, [field]: adjustedDate.toISOString().split('T')[0] });
        } else {
            setData({ ...data, [field]: "" });
        }
    };

    return (
        <TestLayout>
            <Head title='Anggaran' />
            <div className='flex justify-between items-center flex-col md:flex-row mb-4'>
                <h1 className='text-5xl font-sans font-bold'>Pengajuan Anggaran</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="blue">
                            <IconFile className='mr-2' />Ajukan Anggaran
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Pengajuan Anggaran</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="perihal">Perihal</Label>
                                <Input
                                    id="perihal"
                                    value={data.perihal}
                                    onChange={e => setData('perihal', e.target.value)}
                                    required
                                />
                                {errors.perihal && <p className="text-red-500">{errors.perihal}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="tridharma_id">Tridharma</Label>
                                <Select
                                    value={data.tridharma_id}
                                    onValueChange={(value) => setData('tridharma_id', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Tridharma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tridharmas.map((tridharma, i) => (
                                            <SelectItem key={i} value={tridharma.id.toString()}>
                                                {tridharma.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {errors.tridharma_id && <p className="text-red-600">{errors.tridharma_id}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='jumlah_anggaran'>Jumlah Anggaran</Label>
                                <Input
                                    id='jumlah_anggaran'
                                    type='text'
                                    value={formatRupiah(data.jumlah_anggaran)} // Tampilkan nilai terformat dengan awalan Rp
                                    onChange={handleJumlahAnggaranChange} // Tangani perubahan input
                                    required
                                />
                                {errors.jumlah_anggaran && <p className='text-red-500'>{errors.jumlah_anggaran}</p>}
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="anggaran">File Anggaran (PDF/Word)
                                    <span className="text-red-500 text-sm"> *<span>File Maksimal 5MB</span></span>
                                </Label>
                                <Input
                                    type="file"
                                    id="anggaran"
                                    onChange={e => {
                                        const file = e.target.files?.[0] || null;
                                        setData('anggaran', file);
                                    }}
                                    required
                                />
                                {errors.anggaran && <p className="text-red-500">{errors.anggaran}</p>}
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
            <hr className='border-t-2 border-gray-400' />
            <div className='flex gap-2 md:max-w-xl max-w-[350px]'>
                <Select value={selectedTridharma} onValueChange={setSelectedTridharma}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Tridharma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tridharma</SelectItem> {/* Tambahkan opsi "Semua Tridharma" */}
                        {tridharmas.map((tridharma) => (
                            <SelectItem key={tridharma.id} value={tridharma.id.toString()}>
                                {tridharma.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleFilter} className='w-24' variant='blue'>Filter</Button>
            </div>
            <DataTable data={anggarans} columns={column} />
        </TestLayout>
    );
}

export default Index
