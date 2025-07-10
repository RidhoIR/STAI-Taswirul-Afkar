import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Jenis_pembayaran, Laporan, PageProps, Semester, Transaksi } from '@/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
// import { column } from './column';

import { CalendarIcon, Download, ChevronLeft, ChevronRight, Filter, Calendar, ArrowUpRight, DollarSignIcon, CircleDollarSign } from "lucide-react"
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
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { formatRupiah, formatTanggalIndonesia } from '@/lib/utils';
import { TransactionChart } from '@/Components/transaction-chart'
import PembayaranPie from '@/Components/pembayaran-pie'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { DateRangePicker } from '@/Components/date-range-picker'
import { endOfMonth, format, startOfMonth, getYear } from 'date-fns'
import { FormatRupiah } from '@arismun/format-rupiah'
import { Area, AreaChart, Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Tooltip } from '@/Components/ui/tooltip'
import { BarChartKeuangan } from '@/Components/BarChartKeuangan'




interface Props {
    laporans: Laporan[];
    semesters: Semester[];
    latestTransactions: Transaksi[];

}

const Index = ({ laporans, semesters, latestTransactions }: Props) => {

    const [semesterId, setSemesterId] = useState<number>(
        semesters[semesters.length - 1]?.id ?? 0
    );
    const [chartList, setChartList] = useState<any[]>([]);

    // Fetch saat semester dipilih
    const handleFilterChange = (id: number) => {
        setSemesterId(id);
        fetch(`/dashboard/bendahara/chart-by-semester?semester_id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setChartList(data);
            });
    };

    // Jalankan saat component pertama kali render
    useEffect(() => {
        if (semesterId) {
            handleFilterChange(semesterId);
        }
    }, []);

    const [startDate, setStartDate] = useState<Date | undefined>(
        startOfMonth(new Date())
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        endOfMonth(new Date())
    );
    const formattedStart = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const formattedEnd = endDate ? format(endDate, 'yyyy-MM-dd') : null;

    const [summary, setSummary] = useState({
        pemasukan: 0,
        pengeluaran: 0,
        laba_rugi: 0,
        saldo: 0,
        grafik: { pemasukan: 0, pengeluaran: 0 }
    });

    useEffect(() => {
        fetch(`/dashboard/bendahara/summary?start_date=${formattedStart}&end_date=${formattedEnd}`)
            .then(res => res.json())
            .then(data => setSummary(data));
    }, [startDate, endDate]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 + 2 }, (_, i) => 2020 + i);
    const [year, setYear] = useState(new Date().getFullYear())
    const [barData, setBarData] = useState<any[]>([])

    useEffect(() => {
        fetch(`/dashboard/bendahara/bar-chart-data?year=${year}`)
            .then((res) => res.json())
            .then((data) => setBarData(data))
    }, [year])

    return (
        <TestLayout>
            <Head title='Dashboard' />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <main className="container mx-auto px-4 py-8">
                    <Card className='p-6 bg-white shadow-sm items-center justify-center mb-4'>
                        <div className='mb-4'>
                            <DateRangePicker
                                from={startDate}
                                to={endDate}
                                onSelect={(from, to) => {
                                    setStartDate(from);
                                    setEndDate(to);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="shadow-sm bg-green-500 border-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl text-white font-medium">Total Pemasukan</CardTitle>
                                    <ArrowDownCircle size={35} className="bg-green-400 rounded-full p-1 text-white" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        <FormatRupiah value={summary.pemasukan} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm bg-red-500 border-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-medium text-white">Total Pengeluaran</CardTitle>
                                    <ArrowUpCircle size={35} className="bg-red-400 rounded-full p-1 text-white" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        <FormatRupiah value={summary.pengeluaran} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`shadow-sm ${summary.laba_rugi >= 0 ? "bg-blue-500 border-none" : "bg-orange-500 border-none"}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl text-white font-medium">
                                        {summary.laba_rugi >= 0 ? "Laba" : "Rugi"}
                                    </CardTitle>
                                    {summary.laba_rugi >= 0 ? (
                                        <TrendingUp size={35} className="bg-blue-400 rounded-full p-1 text-white" />
                                    ) : (
                                        <TrendingDown size={35} className="bg-orange-400 rounded-full p-1 text-white" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${summary.laba_rugi >= 0 ? "text-white" : "text-white"}`}>
                                        <FormatRupiah value={summary.laba_rugi} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm bg-purple-500 border-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl text-white font-medium">Saldo</CardTitle>
                                    <CircleDollarSign size={35} className="bg-purple-400 rounded-full p-1 text-white" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        <FormatRupiah value={summary.saldo} />
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </Card>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                        <Card className=' p-6 bg-white shadow-sm items-center justify-center'>
                            <div>
                                <div className='mb-4'>
                                    <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((y) => (
                                                <SelectItem key={y} value={String(y)}>
                                                    {y}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <BarChartKeuangan data={barData} />
                            </div>
                        </Card>
                        <Card className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Transaksi Terakhir</h2>
                            <div className="overflow-y-auto overflow-x-auto">
                                <table className="min-w-full text-sm text-left border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border">#</th>
                                            <th className="px-4 py-2 border">Tanggal</th>
                                            <th className="px-4 py-2 border">Nama</th>
                                            <th className="px-4 py-2 border">Pembayaran</th>
                                            <th className="px-4 py-2 border">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestTransactions.map((tx, index) => (
                                            <tr key={tx.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border">{index + 1}</td>
                                                <td className="px-4 py-2 border">
                                                    {formatTanggalIndonesia(tx.tanggal_pembayaran.toLocaleString('id-ID'))}
                                                </td>
                                                <td className="px-4 py-2 border">{tx.mahasiswa.name}</td>
                                                <td className="px-4 py-2 border uppercase">{tx.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran}</td>
                                                <td className="px-4 py-2 border text-right">
                                                    <FormatRupiah value={tx.jumlah} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>


                    {/* <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <BarChartKeuangan data={barData} /> */}
                    {/* <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={summary.grafik}>
                            <XAxis dataKey="tanggal" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="saldo" stroke="#3b82f6" fill="#bfdbfe" />
                        </AreaChart>
                    </ResponsiveContainer> */}

                    <Card className='p-6 bg-white shadow-sm items-center justify-center'>
                        <div className="max-w-xs items-center justify-center mb-4">
                            <label className="text-sm font-medium">Semester</label>
                            <Select
                                value={String(semesterId)}
                                onValueChange={(val) => handleFilterChange(Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.semester} - {s.tahun_ajaran}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid grid-cols-4 gap-2'>
                            {chartList.map((item, index) => (
                                <div key={item.jenis || index}> {/* ← key harus di sini */}
                                    <div className="space-y-6 items-center justify-center">
                                        <div className="flex max-w-full items-center justify-center">
                                            <PembayaranPie title={item.jenis} data={item.data} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </main>
            </div>
        </TestLayout >
    )
}

export default Index;