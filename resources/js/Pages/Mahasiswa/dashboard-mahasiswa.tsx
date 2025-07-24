import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps, Semester, TanggunganPembayaran, Transaksi } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, CheckCircle2, User, XCircle } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { FormatRupiah } from '@arismun/format-rupiah'



interface Props {
    tanggungan_pembayaran: TanggunganPembayaran[];
    mahasiswa: Mahasiswa;
    transaksi: Transaksi[];
    semester_aktif: Semester;
    totalTunggakan: number;
    status_spp: string;
    totalTransaksi: number;
    allTanggungan: number;

}

const Index = ({ mahasiswa, tanggungan_pembayaran, transaksi, totalTunggakan, semester_aktif, status_spp, totalTransaksi, allTanggungan }: Props) => {
    const { flash } = usePage<PageProps>().props;
    // const { mahasiswa } = usePage<PageProps>().props;
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;
    console.log(flash);

    const isBeasiswa = mahasiswa.jenis_mahasiswa === 'beasiswa';


    console.log(semester_aktif);


    return (
        <TestLayout>
            <Head title='Dashboard' />
            <div className='grid grid-cols-2 gap-4'>
                <div className="space-y-4">
                    <Card className="p-6 bg-white shadow-sm">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <User className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="space-y-1 text-center">
                                <h1 className="text-xl font-semibold text-gray-900 uppercase">
                                    {mahasiswa.name}
                                </h1>
                                <p className="text-gray-600 text-sm">{mahasiswa.nim}</p>
                            </div>
                        </div>
                    </Card>
                    <div className='grid grid-cols-2 gap-4'>
                        <Card className="p-6 bg-white shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className='flex flex-col border-b-2 items-center w-3/4 pb-2'>
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                    <h3 className="text-lg font-medium text-gray-900">SPP</h3>
                                    <p className='text-sm'>{semester_aktif.semester} {semester_aktif.tahun_ajaran}</p>
                                </div>
                                <div>
                                    <p
                                        className={cn(
                                            "text-lg font-bold mt-2",
                                            (isBeasiswa || status_spp === "Lunas") ? "text-green-600" : "text-red-600"
                                        )}
                                    >
                                        {isBeasiswa ? "Lunas" : status_spp}
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-white shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className='flex flex-col border-b-2 items-center w-3/4 pb-2'>
                                    <XCircle className="h-12 w-12 text-red-600" />
                                    <h3 className="text-lg font-medium text-gray-900">Tunggakan</h3>
                                </div>
                                <div>
                                    <p className="text-red-600 text-lg font-bold mt-2">
                                        <FormatRupiah value={totalTunggakan} />
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <Card className=" bg-white shadow-sm">
                        <div className='p-6 bg-gray-50 border-b border-gray-200'>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detail Tunggakan
                            </h3>
                        </div>


                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Jumlah Semua Tanggungan</span>
                                <span className="font-medium">
                                    <FormatRupiah value={allTanggungan} />
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Jumlah Uang Dibayarkan</span>
                                <span className="font-medium">
                                    <FormatRupiah value={totalTransaksi} />
                                </span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">TOTAL</span>
                                    <span className="font-medium text-red-600">
                                        <FormatRupiah value={totalTunggakan} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                <div className="">
                    <Card className="bg-white shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Rekaman Pembayaran</h2>
                        </div>

                        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700">Semester</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Tgl. Pembayaran</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Deskripsi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transaksi.length > 0 ? (
                                        transaksi.map((item, index) => (
                                            <TableRow key={index} className="hover:bg-gray-50">
                                                <TableCell className="font-medium text-gray-900">
                                                    {item.detail_jenis_pembayaran.semester ? `${item.detail_jenis_pembayaran.semester.semester} ${item.detail_jenis_pembayaran.semester.tahun_ajaran}` : <span className="text-red-500">Tidak ada semester</span>}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {format(new Date(item.tanggal_pembayaran), 'dd MMMM yyyy')}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="whitespace-pre-line text-sm">
                                                        <p className="text-xs">{item.no_invoice}</p>
                                                        <p className="text-base uppercase text-black">
                                                            {item.detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran} - {item.deskripsi}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                                                Belum ada Pembayaran
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="text-center space-y-4">
                                <p className="text-sm font-medium text-gray-900">
                                    INSTITUT TEKNOLOGI ADHI TAMA SURABAYA
                                </p>
                                <p className="text-xs text-gray-600">
                                    © 2025 DSI ITATS • Privacy
                                </p>
                                <div className="flex justify-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">f</span>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">t</span>
                                    </div>
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">▶</span>
                                    </div>
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">@</span>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">in</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </Card>
                </div>
            </div>


        </TestLayout >
    )
}

export default Index;
