import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps, Semester, TanggunganPembayaran, Transaksi } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { ArrowDownCircle, ArrowUpCircle, CalendarIcon, CheckCircle, CheckCircle2, CircleDollarSign, Clipboard, ClipboardCheck, ClipboardIcon, FileCheck, FilePen, User, XCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { FileText, Download } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';


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
    anggaranCount: number;
    anggarandisetujui: number;
    lpjCount: number;
    lpjDiterima: number;

}

const Index = ({ anggaranCount, anggarandisetujui, lpjCount, lpjDiterima }: Props) => {
    const { flash } = usePage<PageProps>().props;
    // const { mahasiswa } = usePage<PageProps>().props;
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { semesters } = usePage<PageProps>().props;
    console.log(flash);


    return (
        <TestLayout>
            <Head title='Dashboard' />
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Card className="shadow-sm ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl  font-medium">Anggaran</CardTitle>
                        <FilePen size={35} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {anggaranCount}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm  ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-medium ">Anggaran Disetujui</CardTitle>
                        <FileCheck size={35} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {anggarandisetujui}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm  ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-medium ">Laporan Pertanggungjawaban</CardTitle>
                        <ClipboardIcon size={35} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {lpjCount}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-white ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl  font-medium">LPJ Diterima</CardTitle>
                        <ClipboardCheck size={35}/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {lpjDiterima}
                        </div>
                    </CardContent>
                </Card>

            </div>


        </TestLayout >
    )
}

export default Index;
