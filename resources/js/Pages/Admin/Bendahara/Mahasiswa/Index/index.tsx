import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';


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
