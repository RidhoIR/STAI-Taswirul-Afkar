import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps, TanggunganPembayaran, Transaksi } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import { FileText, Download } from 'lucide-react';

import { Card, CardContent } from '@/Components/ui/card';

import { cn } from "@/lib/utils"
// import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs"



interface TransaksiProps {
    tanggungan_pembayaran: TanggunganPembayaran[];
    transaksis: Transaksi[];
    mahasiswa: Mahasiswa;

}

const Index = ({ transaksis, mahasiswa, tanggungan_pembayaran, }: TransaksiProps) => {
    const { flash } = usePage<PageProps>().props;
    // const { mahasiswa } = usePage<PageProps>().props;
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;
    console.log(flash);



    // console.log(mahasiswa);
    // console.log(jenis_pembayaran);
    const [open, setOpen] = useState(false);
    const [date, setDate] = React.useState<Date>()
    const { data, setData, post, processing, errors } = useForm({
        jenis_pembayaran_id: '',
        jumlah: '',
        deskripsi: '',
        semester_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.transaksis.store', mahasiswa.id), {
            onSuccess: () => {
                setOpen(false);
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
        setData('jumlah', value); // Simpan nilai asli (hanya angka)
    };

    const handleJenisPembayaranChange = (value: string) => {
        setData('jenis_pembayaran_id', value);

        const selected = jenis_pembayaran.find(j => j.id.toString() === value);
        if (selected) {
            setData('deskripsi', `Pembayaran ${selected.nama_pembayaran} oleh ${mahasiswa.name}`);
        } else {
            setData('deskripsi', '');
        }
    };

    const sortedTransaksi = [...transaksis].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });



    return (
        <TestLayout>
            <Head title='Riwayat Pembayaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <div className='flex  flex-col md:flex-row mb-4'>
                    {/* Directly display the name of the mahasiswa object */}
                    <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Riwayat Transaksi
                                    </h1>
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-800">{mahasiswa.name}</p>
                                            <p className="text-sm text-gray-500">NIM: {mahasiswa?.nim}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-4 h-px bg-gray-200 w-full" />
            </div>
            <DataTable data={transaksis} columns={column} />
        </TestLayout >
    )
}

export default Index;
