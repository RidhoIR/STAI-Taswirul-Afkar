import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Laporan, PageProps } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
import { column } from './column';

import { CalendarIcon, Download, ChevronLeft, ChevronRight, Filter, Calendar, ArrowUpRight } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Calendar as CalendarComponent } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { formatRupiah } from '@/lib/utils';
import { TransactionChart } from '@/Components/transaction-chart'

interface LaporanProps {
    laporans: Laporan[];
}

const Index = ({ laporans }: LaporanProps) => {
    const [open, setOpen] = useState(false);
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;

    // Make sure we have laporans before accessing
    const currentLaporan = laporans && laporans.length > 0 ? laporans[currentPeriodIndex] : null;

    const { data, setData, post, processing, errors, reset } = useForm({
        periode_awal: "",
        periode_akhir: "",
        saldo_awal: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.laporan.store'), {
            onSuccess: () => {
                setOpen(false);
                console.log("Pembayaran berhasil");
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    const formatRupiahInput = (value: string) => {
        const numberString = value.replace(/[^,\d]/g, '').toString();
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('saldo_awal', value);
    };

    // Calculate the percentage change from previous period
    const getPreviousPeriod = () => {
        if (laporans && currentPeriodIndex < laporans.length - 1) {
            return laporans[currentPeriodIndex + 1];
        }
        return null;
    };

    const previousPeriod = getPreviousPeriod();
    const peningkatanSaldo = previousPeriod && currentLaporan
        ? ((currentLaporan.saldo_akhir - previousPeriod.saldo_akhir) / previousPeriod.saldo_akhir) * 100
        : 0;

    const handlePreviousPeriod = () => {
        if (laporans && currentPeriodIndex < laporans.length - 1) {
            setCurrentPeriodIndex(currentPeriodIndex + 1);
        }
    };

    const handleNextPeriod = () => {
        if (currentPeriodIndex > 0) {
            setCurrentPeriodIndex(currentPeriodIndex - 1);
        }
    };

    const handleRowClick = (id: number) => {
        if (id) {
            window.location.href = route('admin.bendahara.laporan.show', id);
        }
    };

    return (
        <TestLayout>
            <Head title='Laporan Keuangan' />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <header className="bg-white dark:bg-slate-950 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                            Laporan Keuangan
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Pantau keuangan dan analisis data pemasukan dan pengeluaran
                        </p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    {/* Period Navigation */}
                    {currentLaporan && (
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePreviousPeriod}
                                    disabled={!laporans || currentPeriodIndex >= laporans.length - 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="mx-4 text-center">
                                    <h2 className="font-medium text-slate-700 dark:text-slate-300">
                                        {new Date(currentLaporan.periode_awal).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })} - {new Date(currentLaporan.periode_akhir).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </h2>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextPeriod}
                                    disabled={currentPeriodIndex <= 0}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Download className="mr-2" />Tambah Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Laporan</DialogTitle>
                                            <DialogDescription>
                                                Silahkan Masukkan Data yang sesuai
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submit}>
                                            <div className='mb-4'>
                                                <Label htmlFor='periode_awal'>Periode Awal<span className='text-red-500'>*</span></Label>
                                                <Input
                                                    id='periode_awal'
                                                    type='date'
                                                    value={data.periode_awal}
                                                    onChange={(e) => setData('periode_awal', e.target.value)}
                                                    required
                                                />
                                                {errors.periode_awal && <p className='text-red-500'>{errors.periode_awal}</p>}
                                            </div>
                                            <div className='mb-4'>
                                                <Label htmlFor='periode_akhir'>Periode Akhir<span className='text-red-500'>*</span></Label>
                                                <Input
                                                    id='periode_akhir'
                                                    type='date'
                                                    value={data.periode_akhir}
                                                    onChange={(e) => setData('periode_akhir', e.target.value)}
                                                    required
                                                />
                                                {errors.periode_akhir && <p className='text-red-500'>{errors.periode_akhir}</p>}
                                            </div>
                                            <div className='mb-4'>
                                                <Label htmlFor='saldo_awal'>Saldo Awal<span className='text-red-500'>*</span></Label>
                                                <Input
                                                    id='saldo_awal'
                                                    type='text'
                                                    value={formatRupiahInput(data.saldo_awal)}
                                                    onChange={handleJumlahChange}
                                                    required
                                                />
                                                {errors.saldo_awal && <p className='text-red-500'>{errors.saldo_awal}</p>}
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={processing}>
                                                    Simpan
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
                    )}

                    {currentLaporan && (
                        <>
                            {/* Financial Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <Card className="bg-white dark:bg-slate-800">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pemasukan</p>
                                                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                                    {formatRupiah(currentLaporan.total_pemasukan)}
                                                </h3>
                                            </div>
                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                                                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-slate-800">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
                                                <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                                                    {formatRupiah(currentLaporan.total_pengeluaran)}
                                                </h3>
                                            </div>
                                            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                                                <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400 rotate-180" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-slate-800">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Awal</p>
                                                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                                    {formatRupiah(currentLaporan.saldo_awal)}
                                                </h3>
                                            </div>
                                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-slate-800">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Akhir</p>
                                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                                                    {formatRupiah(currentLaporan.saldo_akhir)}
                                                </h3>
                                                <p className={`text-xs mt-1 ${peningkatanSaldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {peningkatanSaldo >= 0 ? '↑' : '↓'} {Math.abs(peningkatanSaldo).toFixed(1)}% dari periode sebelumnya
                                                </p>
                                            </div>
                                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full">
                                                <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Chart and Summary section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                                <div className="lg:col-span-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Grafik Keuangan</CardTitle>
                                            <CardDescription>
                                                Visualisasi pemasukan dan pengeluaran periode {new Date(currentLaporan.periode_awal).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TransactionChart pemasukan={currentLaporan.total_pemasukan} pengeluaran={currentLaporan.total_pengeluaran} />
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ringkasan Keuangan</CardTitle>
                                            <CardDescription>Detail posisi keuangan saat ini</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Awal</p>
                                                    <p className="text-2xl font-semibold">{formatRupiah(currentLaporan.saldo_awal)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Pemasukan</p>
                                                    <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                                                        +{formatRupiah(currentLaporan.total_pemasukan)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
                                                    <p className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
                                                        -{formatRupiah(currentLaporan.total_pengeluaran)}
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t">
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Akhir</p>
                                                    <p className="text-2xl font-bold">{formatRupiah(currentLaporan.saldo_akhir)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className="mt-8">
                                <Tabs defaultValue="all">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold">Daftar Laporan</h2>
                                        <TabsList>
                                            <TabsTrigger value="all">Semua Periode</TabsTrigger>
                                            <TabsTrigger value="recent">Terbaru</TabsTrigger>
                                        </TabsList>
                                    </div>
                                    <TabsContent value="all" className="space-y-4">
                                        <Card>
                                            <CardContent className="pt-6">
                                                {laporans && laporans.length > 0 ? (
                                                    <DataTable
                                                        data={laporans}
                                                        // You'll need to define your columns according to your data structure
                                                        columns={column}
                                                    />
                                                ) : (
                                                    <div className="text-center py-10">
                                                        <p className="text-slate-500">Belum ada data laporan</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="recent" className="space-y-4">
                                        <Card>
                                            <CardContent className="pt-6">
                                                {laporans && laporans.length > 0 ? (
                                                    <DataTable
                                                        data={laporans.slice(0, 2)}
                                                        columns={column}
                                                    />
                                                ) : (
                                                    <div className="text-center py-10">
                                                        <p className="text-slate-500">Belum ada data laporan terbaru</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </>
                    )}
                    {(!laporans || laporans.length === 0) && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">Belum ada data laporan</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Silakan tambahkan laporan keuangan baru</p>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Download className="mr-2" />Tambah Laporan Baru
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tambah Laporan</DialogTitle>
                                        <DialogDescription>
                                            Silahkan Masukkan Data yang sesuai
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={submit}>
                                        <div className='mb-4'>
                                            <Label htmlFor='periode_awal'>Periode Awal<span className='text-red-500'>*</span></Label>
                                            <Input
                                                id='periode_awal'
                                                type='date'
                                                value={data.periode_awal}
                                                onChange={(e) => setData('periode_awal', e.target.value)}
                                                required
                                            />
                                            {errors.periode_awal && <p className='text-red-500'>{errors.periode_awal}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor='periode_akhir'>Periode Akhir<span className='text-red-500'>*</span></Label>
                                            <Input
                                                id='periode_akhir'
                                                type='date'
                                                value={data.periode_akhir}
                                                onChange={(e) => setData('periode_akhir', e.target.value)}
                                                required
                                            />
                                            {errors.periode_akhir && <p className='text-red-500'>{errors.periode_akhir}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor='saldo_awal'>Saldo Awal<span className='text-red-500'>*</span></Label>
                                            <Input
                                                id='saldo_awal'
                                                type='text'
                                                value={formatRupiahInput(data.saldo_awal)}
                                                onChange={handleJumlahChange}
                                                required
                                            />
                                            {errors.saldo_awal && <p className='text-red-500'>{errors.saldo_awal}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                Simpan
                                            </Button>
                                            <Button variant="outline" onClick={() => setOpen(false)}>
                                                Batal
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </main>
            </div>
        </TestLayout>
    )
}

export default Index;