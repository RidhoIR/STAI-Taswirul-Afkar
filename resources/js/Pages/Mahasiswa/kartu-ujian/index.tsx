import TestLayout from '@/Layouts/TestLayout'
import { Head, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Printer, Download } from 'lucide-react'
import { Semester } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'

interface KartuUjianProps {
    semesters: Semester[];
    statusPembayaranList: {
        semester_id: number;
        status_uts: string;
        status_uas: string;
    }[];
    statusProposal: string;
    statusSkripsi: string;
    jenis_mahasiswa: string;
}


const Index = ({ semesters, statusPembayaranList, statusProposal, statusSkripsi, jenis_mahasiswa }: KartuUjianProps) => {
    const [selectedSemester, setSelectedSemester] = useState<string>('all'); // empty string = semua semester
    console.log(jenis_mahasiswa);
    const filteredData = selectedSemester === 'all'
        ? statusPembayaranList
        : statusPembayaranList.filter(
            (item) => item.semester_id.toString() === selectedSemester
        );

    const getSemesterName = (id: number) => {
        const sem = semesters.find(s => s.id === id);
        return sem ? `Semester ${sem.semester} ${sem.tahun_ajaran}` : 'Semester Tidak Diketahui';
    }

    const formatStatus = (status: string) => {
        return status
            .replace(/_/g, ' ')                      // Ganti "_" dengan spasi
            .replace(/\b\w/g, (c) => c.toUpperCase()); // Kapitalisasi setiap kata
    };
    const isBeasiswa = jenis_mahasiswa === 'beasiswa';


    return (
        <TestLayout>
            <Head title='Kartu Ujian' />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <header className="bg-white dark:bg-slate-950 border-b-2 ">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                            Kartu Ujian
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Pilih semester untuk melihat status pembayaran
                        </p>
                    </div>
                </header>
                {/* <h1 className="text-2xl font-bold text-gray-900 mb-1">Kartu Ujian</h1>
                <p className="text-gray-600 mb-6">Pilih semester untuk melihat status pembayaran</p> */}

                {/* PILIH SEMESTER */}
                <div className='container mx-auto px-4 py-8'>
                    <div className="mb-6 max-w-xs">
                        <Select onValueChange={(value) => setSelectedSemester(value)} defaultValue="">
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Semester</SelectItem>
                                {semesters.map((s) => (
                                    <SelectItem key={s.id} value={s.id.toString()}>
                                        Semester {s.semester} {s.tahun_ajaran}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* TABEL STATUS PEMBAYARAN */}
                    <div className='grid grid-cols-2 gap-4 '>
                        {filteredData.map((data, index) => {
                            // const isBeasiswa = jenis_mahasiswa === 'beasiswa_penuh';
                            const isLunasUTS = isBeasiswa || data.status_uts === 'lunas';
                            const isLunasUAS = isBeasiswa || data.status_uas === 'lunas';
                            const bisaCetak = isLunasUTS && isLunasUAS;

                            return (
                                <div key={index} className="bg-white p-4 rounded-lg shadow border mb-4">
                                    <h2 className="text-xl font-semibold mb-4">
                                        {getSemesterName(data.semester_id)}
                                    </h2>
                                    <div className="items-center mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium">Pembayaran UTS :</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium  ${isBeasiswa || data.status_uts === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {isBeasiswa ? 'Lunas (Beasiswa)' : formatStatus(data.status_uts)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium">Pembayaran UAS :</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium  ${isBeasiswa || data.status_uas === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {isBeasiswa ? 'Lunas (Beasiswa)' : formatStatus(data.status_uas)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isLunasUTS}
                                            onClick={() => window.open(route('mahasiswa.kartu-ujian.cetak', [data.semester_id, 'UTS']))}
                                        >
                                            <Printer className="w-4 h-4 mr-2" />
                                            Cetak Kartu UTS
                                        </button>

                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isLunasUAS}
                                            onClick={() => window.open(route('mahasiswa.kartu-ujian.cetak', [data.semester_id, 'UAS']))}
                                        >
                                            <Printer className="w-4 h-4 mr-2" />
                                            Cetak Kartu UAS
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {/* KARTU UJIAN PROPOSAL */}
                        <div className="bg-white p-4 rounded-lg shadow border mb-4">
                            <h2 className="text-xl font-semibold mb-4">Ujian Proposal</h2>
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-medium">Status Pembayaran:</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${jenis_mahasiswa === 'beasiswa' || statusProposal === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {jenis_mahasiswa === 'beasiswa' ? 'Lunas (Beasiswa)' : formatStatus(statusProposal)}
                                </span>
                            </div>
                            <div>
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isBeasiswa && statusProposal !== 'lunas'}
                                    onClick={() => window.open(route('mahasiswa.kartu-ujian.proposal', [0, 'Proposal']), '_blank')}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Cetak Kartu Proposal
                                </button>
                            </div>
                        </div>

                        {/* KARTU UJIAN SKRIPSI */}
                        <div className="bg-white p-4 rounded-lg shadow border mb-4">
                            <h2 className="text-xl font-semibold mb-4">Ujian Skripsi</h2>
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-medium">Status Pembayaran:</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${jenis_mahasiswa === 'beasiswa' || statusSkripsi === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {jenis_mahasiswa === 'beasiswa' ? 'Lunas (Beasiswa)' : formatStatus(statusSkripsi)}
                                </span>
                            </div>
                            <div>
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isBeasiswa && statusSkripsi !== 'lunas'}
                                    onClick={() => window.open(route('mahasiswa.kartu-ujian.skripsi', [0, 'Skripsi']), '_blank')}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Cetak Kartu Skripsi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TestLayout>
    );
}

export default Index;
