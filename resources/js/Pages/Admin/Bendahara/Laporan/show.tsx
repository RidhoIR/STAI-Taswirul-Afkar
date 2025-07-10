import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { DetailLaporan, Laporan, PageProps } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
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
import { formatRupiah, formatTanggalIndonesia } from '@/lib/utils';
import { TransactionChart } from '@/Components/transaction-chart'
import { Badge } from '@/Components/ui/badge'
import { DetailPemasukanColumn } from './detail-pemasukan-column'
import { DetailPengeluaranColumn } from './detail-pengeluaran-column'

interface DetailLaporanProps {
    laporan: Laporan;
    detailLaporans: DetailLaporan[];
    pemasukan: DetailLaporan[];
    pengeluaran: DetailLaporan[];
    total_pemasukan: number;
    total_pengeluaran: number;
}

const show = ({ laporan, detailLaporans, pemasukan, pengeluaran, total_pemasukan, total_pengeluaran }: DetailLaporanProps) => {

    const selisih = total_pemasukan - total_pengeluaran;

    return (
        <TestLayout>
            <Head title='Detail Laporan' />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <header className="bg-white dark:bg-slate-950 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                            Laporan Keuangan
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Periode : {formatTanggalIndonesia(laporan.periode_awal)} - {formatTanggalIndonesia(laporan.periode_akhir)}
                        </p>
                    </div>
                </header>
                <main className='container mx-auto px-4 py-8'>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                        <div className="lg:col-span-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ringkasan Laporan</CardTitle>
                                    <CardDescription>
                                        Data ringkasan laporan keuangan bulan {new Date(laporan.periode_awal).toLocaleDateString('id-ID', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Awal</p>
                                            <p className="text-xl font-semibold">{formatRupiah(laporan.saldo_awal)}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Pemasukan</p>
                                            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(laporan.total_pemasukan)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
                                            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400">
                                                {formatRupiah(laporan.total_pengeluaran)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Akhir</p>
                                            <p className="text-xl font-semibold">{formatRupiah(laporan.saldo_akhir)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Laporan</CardTitle>
                                    <CardDescription>Detail informasi periode laporan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                                                <Calendar className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Periode</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(laporan.periode_awal).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })} - {new Date(laporan.periode_akhir).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={laporan.total_pemasukan > laporan.total_pengeluaran ? "success" : "destructive"} className="px-3 py-1">
                                                {laporan.total_pemasukan > laporan.total_pengeluaran ? "Surplus" : "Defisit"}
                                            </Badge>
                                            <p className="text-sm text-slate-500">
                                                {formatRupiah(Math.abs(laporan.total_pemasukan - laporan.total_pengeluaran))}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className='mb-8'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Transaksi</CardTitle>
                                <CardDescription>Daftar Rincian Dalam Periode</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="all">
                                    {/* <div className="flex items-center gap-3 justify-end"> */}
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="all">Pemasukan</TabsTrigger>
                                        <TabsTrigger value="recent">Pengeluaran</TabsTrigger>
                                    </TabsList>
                                    {/* </div> */}
                                    <TabsContent value="all" className="space-y-4">
                                        <DataTable columns={DetailPemasukanColumn} data={pemasukan} />
                                    </TabsContent>
                                    <TabsContent value="recent" className="space-y-4">
                                        <DataTable columns={DetailPengeluaranColumn} data={pengeluaran} />
                                    </TabsContent>
                                </Tabs>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Pemasukan</p>
                                        <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(total_pemasukan)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
                                        <p className="text-xl font-semibold text-rose-600 dark:text-rose-400">
                                            {formatRupiah(total_pengeluaran)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Selisih</p>
                                        <p className={`text-xl font-semibold ${selisih < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {formatRupiah(selisih)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>

        </TestLayout>
    )
}

export default show
