import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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

const Index = ({ anggarans, filterYear, filterTridharma, availableYears, tridharmas }: AnggaranProps) => {
    const { flash } = usePage<PageProps>().props;

    const [selectedYear, setSelectedYear] = useState(filterYear);
    const [selectedTridharma, setSelectedTridharma] = useState(filterTridharma || '');

    const handleFilter = () => {
        const query = new URLSearchParams({
            year: selectedYear,
            ...(selectedTridharma !== "all" && { tridharma_id: selectedTridharma }) //menggunakan spread operator
        }).toString();
        window.location.href = route('pengurus.anggaran.index') + '?' + query;
    };

    const [date, setDate] = React.useState<Date>()


    return (
        <TestLayout>
            <Head title='Anggaran' />
            <div className='md:max-w-full max-w-[350px]'>
                <div className='flex md:justify-between flex-col md:flex-row mb-4'>
                    <h1 className='md:text-5xl text-xl font-sans font-bold'>Pengajuan Anggaran</h1>
                </div>
                <hr className='border-t-2 border-gray-400' />
            </div>
            <div className='flex gap-2 md:max-w-xl max-w-[350px]'>
                <Select value={selectedTridharma} onValueChange={setSelectedTridharma}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Tridharma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tridharma</SelectItem> {/* Tambahkan opsi "Semua Tridharma" */}
                        {tridharmas.map((tridharma) => (
                            <SelectItem key={tridharma.id} value={tridharma.id.toString()}>
                                {tridharma.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleFilter} className='w-24' variant='blue'>Filter</Button>
            </div>
            <DataTable data={anggarans} columns={column} />
        </TestLayout>
    )
}

export default Index;
