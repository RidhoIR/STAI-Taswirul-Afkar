import AdminLayout from '@/Layouts/AdminLayout';
import { Lpj, PageProps, User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import SectionTitle from '@/Components/section-title';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { BsPencilSquare, BsPersonAdd } from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { Alert } from '@/Components/ui/alert';
import { Card, CardHeader, CardTitle } from '@/Components/ui/card';
import TestLayout from '@/Layouts/TestLayout';

interface LpjProps {
    lpjs: Lpj[];
}

const Index = ({ lpjs }: LpjProps) => {
    const flash = usePage<PageProps>().props.flash;
    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing } = useForm<{
        id_anggaran: string;
        file_laporan: File | null;
        foto_dokumentasi: File | null;
        narasi: string;
    }>({
        id_anggaran: '',
        file_laporan: null,
        foto_dokumentasi: null,
        narasi: '',
    });

    // Handle the form submit
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file_laporan) {
            alert('File anggaran harus diunggah.');
            return;
        }

        if (!data.foto_dokumentasi) {
            alert('File dokumentasi harus diunggah.');
            return;
        }

        post(route('pengurus.lpj.store'), {
            onSuccess: () => setOpen(false),
        });
    };
    const { anggarans } = usePage<PageProps>().props;


    return (
        <TestLayout>
            <Head title='Laporan Pertanggungjawaban' />
            <div>
                <div className='flex justify-between items-center flex-col md:flex-row mb-4'>
                    <h1 className='text-5xl font-sans font-bold'>Laporan Pertanggungjawaban</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="blue" size="default">
                                <BsPersonAdd size={20} className='mr-2' /> Tambah Laporan
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Laporan</DialogTitle>
                                <DialogDescription>
                                    Masukkan data laporan pertanggungjawaban.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submit} encType="multipart/form-data">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="id_anggaran">Anggaran</Label>
                                        <Select
                                            value={data.id_anggaran}
                                            onValueChange={(value) => setData('id_anggaran', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Anggaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {anggarans.map((anggaran, i) => (
                                                    <SelectItem key={i} value={anggaran.id.toString()}>
                                                        {anggaran.perihal}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.id_anggaran && <p className="text-red-600">{errors.id_anggaran}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="file_laporan">File Anggaran (PDF/Word)</Label>
                                        <Input
                                            type="file"
                                            id="file_laporan"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null; // Optional chaining with fallback to null
                                                setData('file_laporan', file); // Set file or null
                                            }}
                                            required
                                        />
                                        {errors.file_laporan && <p className="text-red-500">{errors.file_laporan}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="foto_dokumentasi">Foto Dokumentasi</Label>
                                        <Input
                                            id="foto_dokumentasi"
                                            type="file"
                                            onChange={e => setData('foto_dokumentasi', e.target.files?.[0] || null)}  // Capture file
                                        />
                                        {errors.foto_dokumentasi && <p className="text-red-600">{errors.foto_dokumentasi}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="narasi">Narasi</Label>
                                        <Input
                                            id="narasi"
                                            value={data.narasi}
                                            onChange={e => setData('narasi', e.target.value)}
                                        />
                                        {errors.narasi && <p className="text-red-600">{errors.narasi}</p>}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing}>
                                            Simpan Laporan
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <hr className='border-t-2 border-gray-400' />
            </div>
            <DataTable data={lpjs} columns={column} />
        </TestLayout >
    );
};

export default Index;
