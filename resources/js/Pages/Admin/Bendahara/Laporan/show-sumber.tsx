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
import { TransaksiHarianColumn } from './transaksi-harian-column'
import { HonorSkripsiColumn } from './honor-skripsi-column'
import { HonorUjianColumn } from './honor-ujian-column'
import { HonorariumColumns } from './honorarium-column'
import { TransaksiColumn } from './transaksi-column'
import { AnggaranColumn } from './anggaran-column'
import { HonorProposalColumns } from './honor-proposal-column'
import { HonorPplColumns } from './honor-ppl-column'
import { HonorWisudaColumns } from './honor-wisuda-column'

interface SumberDetailProps {
    laporan: Laporan;
    sumber: string;
    data: any[];
    total: number;
}

const ShowSumber = ({ laporan, sumber, data }: SumberDetailProps) => {
    console.log(data)
    console.log(sumber)
    // console.log(laporan.detail_laporans[0].jenis)
    const detail = laporan.detail_laporans?.find((detail) => detail.sumber === sumber.toLowerCase().replace(/\s+/g, '_'))
    return (
        <TestLayout>
            <Head title="Show Sumber" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <header className="bg-white dark:bg-slate-950 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                                    {sumber}
                                </h1>
                                <div className="text-slate-500 dark:text-slate-400 mt-1 capitalize">
                                    <Badge variant={detail?.jenis === 'pemasukan' ? 'success' : 'destructive'}>
                                        {detail?.jenis}
                                    </Badge>
                                    <span> - {formatRupiah(detail?.jumlah ?? 0)}</span>
                                </div>
                            </div>
                            <div>
                                <Button variant="outline" onClick={() => window.history.back()} >
                                    <ChevronLeft className="w-4 h-4 " /> Kembali
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className='container mx-auto px-4 py-8'>
                    <div className='mb-8'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Transaksi - {sumber}</CardTitle>
                                <CardDescription>Rincian transaksi dari sumber</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.length > 0 ? (
                                    <>
                                        {sumber === 'Honor Skripsi' && <DataTable columns={HonorSkripsiColumn} data={data} />}
                                        {sumber === 'Honor Ujian' && <DataTable columns={HonorUjianColumn} data={data} />}
                                        {sumber === 'Honor Proposal' && <DataTable columns={HonorProposalColumns} data={data} />}
                                        {sumber === 'Honor Ppl' && <DataTable columns={HonorPplColumns} data={data} />}
                                        {sumber === 'Honor Wisuda' && <DataTable columns={HonorWisudaColumns} data={data} />}
                                        {sumber === 'Transaksi Harian' && <DataTable columns={TransaksiHarianColumn} data={data} />}
                                        {sumber === 'Honorarium' && <DataTable columns={HonorariumColumns} data={data} />}
                                        {sumber === 'Transaksi' && <DataTable columns={TransaksiColumn} data={data} />}
                                        {sumber === 'Anggaran' && <DataTable columns={AnggaranColumn} data={data} />}
                                    </>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">
                                        Tidak ada data
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </TestLayout>
    )
}

export default ShowSumber
