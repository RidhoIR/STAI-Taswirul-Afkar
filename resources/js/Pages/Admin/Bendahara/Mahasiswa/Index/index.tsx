import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
// import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'

interface AnggaranProps {
    anggarans: Anggaran[];
    filterYear: string;
    filterTridharma: string | null;
    availableYears: number[];
    tridharmas: { id: number; nama: string }[];
}

interface MahasiswaProps {
    mahasiswa: Mahasiswa[];
}

const Index = ({ mahasiswa  }: MahasiswaProps) => {
    const { flash } = usePage<PageProps>().props;

    const [date, setDate] = React.useState<Date>()

    return (
        <TestLayout>
            <Head title='Anggaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <div className='flex md:justify-between flex-col md:flex-row mb-4'>
                    <h1 className='md:text-5xl text-xl font-sans font-bold'>Daftar Mahasiswa</h1>
                </div>
                <hr className='border-t-2 border-gray-400' />
            </div>
            <DataTable data={mahasiswa} columns={column} />
        </TestLayout>
    )
}

export default Index;
