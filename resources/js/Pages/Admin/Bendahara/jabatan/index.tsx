import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Honorarium, HonorPPL, HonorSkripsi, HonorWisuda, Jabatan, Mahasiswa, PageProps, Transaksi } from '@/types'
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



interface JabatanProps {
    jabatans: Jabatan[];
}

const Index = ({ jabatans }: JabatanProps) => {
    const [open, setOpen] = useState(false);

    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;


    const { data, setData, reset, post, errors, processing } = useForm({
        name: '',
        honor: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.honor-jabatan.store'), {
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
        setData('honor', value); // Simpan nilai asli (hanya angka)
    };

    const daftarTugas = [
        "Panitia", "Penguji", "Sekretaris", "Pembimbing"
    ]



    return (
        <TestLayout>
            <Head title='Honor Jabatan' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Honor Jabatan
                                </h1>
                            </div>
                            <div className='flex gap-2'>
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
                                                <Label htmlFor='honor'>Honor<span className='text-red-500'>*</span></Label>
                                                <Input
                                                    id='honor'
                                                    type='text'
                                                    value={formatRupiah(data.honor)}
                                                    onChange={handleJumlahChange} // Tangani perubahan input
                                                    required
                                                />
                                                {errors.honor && <p className='text-red-500'>{errors.honor}</p>}
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

            <DataTable data={jabatans} columns={column} />
        </TestLayout >
    )
}

export default Index;
