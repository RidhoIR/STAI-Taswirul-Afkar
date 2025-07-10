import AdminLayout from '@/Layouts/AdminLayout'
import TestLayout from '@/Layouts/TestLayout'
import { Anggaran, Mahasiswa, PageProps, Semester, Transaksi } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './column';
import { DataTable } from '@/Components/DataTable';
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/Components/ui/button';
import { BsFile, BsFileCheckFill } from 'react-icons/bs';
import { IconFile } from '@irsyadadl/paranoid';
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils"
// import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Card, CardContent } from '@/Components/ui/card'
// import ComboboxMahasiswa from './partials/combobox'
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import ComboboxInput from '@/Components/ComboboxInput'
import { DialogDescription } from '@radix-ui/react-dialog'
import { CommandCombobox } from '@/Components/CommandCombobox'



interface SemesterProps {
    semesters: Semester[];

}

const Index = ({ semesters }: SemesterProps) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = React.useState<Date>()
    const { jenis_pembayaran } = usePage<PageProps>().props;
    const { mahasiswa } = usePage<PageProps>().props;
    // const { semesters } = usePage<PageProps>().props;


    const { data, setData, post, processing, errors } = useForm({
        semester: '',
        tahun_ajaran: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const handleDateSelect = (field: any, date: any) => {
        if (date) {
            // Set the time to noon to avoid timezone issues
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({ ...data, [field]: adjustedDate.toISOString().split('T')[0] });
        } else {
            setData({ ...data, [field]: "" });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.bendahara.semester.store'), {
            onSuccess: () => {
                setOpen(false);
                console.log("Pembayaran berhasil");
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    return (
        <TestLayout>
            <Head title='Semester' />
            <div className='md:max-w-full max-w-[350px]'>
                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Semester
                                </h1>
                            </div>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="blue">
                                        <Download className='mr-2' />Tambah Data
                                    </Button>
                                </DialogTrigger>
                                <DialogContent >
                                    <DialogHeader>
                                        <DialogTitle>Tambah Data</DialogTitle>
                                        <DialogDescription>
                                            Masukkan data
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={submit}>
                                        <div className="mb-4">
                                            <Label htmlFor="semester">Semester</Label>
                                            <Select
                                                value={data.semester}
                                                onValueChange={(value) => setData('semester', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                                    <SelectItem value="Genap">Genap</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.semester && <p className="text-red-600">{errors.semester}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor='tahun_ajaran'>Tahun Ajaran <span className='text-red-500'>*cth: 2024/2025</span></Label>
                                            <Input
                                                id='tahun_ajaran'
                                                type='text'
                                                value={data.tahun_ajaran}
                                                onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                            />
                                            {errors.tahun_ajaran && <p className='text-red-500'>{errors.tahun_ajaran}</p>}
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !data.tanggal_mulai &&
                                                            "text-muted-foreground"
                                                        )}
                                                    >
                                                        {data.tanggal_mulai
                                                            ? format(
                                                                new Date(data.tanggal_mulai),
                                                                "yyyy-MM-dd"
                                                            )
                                                            : "Pilih Tanggal"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            data.tanggal_mulai
                                                                ? new Date(data.tanggal_mulai)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            handleDateSelect("tanggal_mulai", date)
                                                        }

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='mb-4'>
                                            <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !data.tanggal_selesai &&
                                                            "text-muted-foreground"
                                                        )}
                                                    >
                                                        {data.tanggal_selesai
                                                            ? format(
                                                                new Date(data.tanggal_selesai),
                                                                "yyyy-MM-dd"
                                                            )
                                                            : "Pilih Tanggal"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            data.tanggal_selesai
                                                                ? new Date(data.tanggal_selesai)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            handleDateSelect("tanggal_selesai", date)
                                                        }

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                Submit
                                            </Button>
                                            <Button type='button' variant="outline" onClick={() => setOpen(false)}>
                                                Batal
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr className='border-t-2 border-gray-400' />
                    </CardContent>
                </Card>
            </div>
            <DataTable data={semesters} columns={column} />
        </TestLayout>
    )
}

export default Index;
