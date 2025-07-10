import React, { useEffect, useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { HonorSkripsi, HonorUjian, PageProps } from '@/types';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '@/Components/ui/select';

interface HonorUjianProps {
    honor_ujian: HonorUjian;
}

interface TugasItem {
    jenis_tugas: string;
    jumlah: number | string;
    honor_per_tugas: number | string;
    honor_total: number | string;
    [key: string]: string | number; // ✅ index signature agar bisa diakses dengan string
}

const Edit = ({ honor_ujian }: HonorUjianProps) => {
    const [open, setOpen] = useState(false);
    const { semesters } = usePage<PageProps>().props;

    const { put, data, setData, processing, errors, reset } = useForm<{
        semester_id: string;
        nama: string;
        tanggal: string;
        tugas: TugasItem[];
    }>({
        semester_id: '',
        nama: '',
        tanggal: '',
        tugas: [
            {
                jenis_tugas: '',
                jumlah: '',
                honor_per_tugas: '',
                honor_total: '',
            },
        ],
    });

    useEffect(() => {
        if (open) {
            setData('semester_id', honor_ujian.semester.id.toString());
            setData('nama', honor_ujian.nama);
            setData('tanggal', honor_ujian.tanggal.toString());
            setData('tugas', honor_ujian.tugas.map((t) => ({
                jenis_tugas: t.jenis_tugas,
                jumlah: t.jumlah,
                honor_per_tugas: t.honor_per_tugas,
                honor_total: t.honor_total,
            })));
        }
    }, [open]);

    const formatToRupiah = (value: string | number) => {
        const number = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
        if (isNaN(number)) return 'Rp. ';
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const parseRupiah = (str: string) => {
        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    };

    const handleTugasChange = (index: number, field: string, value: any) => {
        const updatedTugas = [...data.tugas];

        if (field === 'honor_per_tugas') {
            updatedTugas[index][field] = parseRupiah(value);
        } else if (field === 'jumlah') {
            updatedTugas[index][field] = parseInt(value);
        } else {
            updatedTugas[index][field] = value;
        }

        setData('tugas', updatedTugas);
    };

    const addTugas = () => {
        setData('tugas', [
            ...data.tugas,
            { jenis_tugas: '', jumlah: '', honor_per_tugas: '', honor_total: '' },
        ]);
    };

    const removeTugas = (index: number) => {
        const updated = data.tugas.filter((_, i) => i !== index);
        setData('tugas', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.bendahara.honor-ujian.uts.update', honor_ujian.id), {
            onSuccess: () => {
                setOpen(false);
                reset();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="blue">
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Edit Honorarium</DialogTitle>
                    <DialogDescription>Silahkan ubah data yang sesuai</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Nama</Label>
                        <Input
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && <p className="text-red-500">{errors.nama}</p>}
                    </div>
                    <div>
                        <Label>Semester</Label>
                        <Select
                            value={data.semester_id}
                            onValueChange={(value) => setData('semester_id', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={String(semester.id)}>
                                        {semester.semester} {semester.tahun_ajaran}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.semester_id && <p className="text-red-600">{errors.semester_id}</p>}
                    </div>

                    <div>
                        <Label>Tanggal</Label>
                        <Input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                        />
                        {errors.tanggal && <p className="text-red-500">{errors.tanggal}</p>}
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Tugas</h3>
                        {data.tugas.map((tugas, index) => (
                            <div key={index} className="border p-4 rounded space-y-2">
                                <div>
                                    <Label>Jenis Tugas</Label>
                                    <Select
                                        value={tugas.jenis_tugas}
                                        onValueChange={(value) =>
                                            handleTugasChange(index, 'jenis_tugas', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Tugas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pembuat soal">Pembuat Soal</SelectItem>
                                            <SelectItem value="korektor">Korektor</SelectItem>
                                            <SelectItem value="pengawas">Pengawas</SelectItem>
                                            <SelectItem value="panitia">Panitia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(tugas.jenis_tugas === 'pembuat soal' || tugas.jenis_tugas === 'korektor' || tugas.jenis_tugas === 'pengawas') && (
                                    <>
                                        <div>
                                            <Label>Jumlah</Label>
                                            <Input
                                                type="number"
                                                value={isNaN(Number(tugas.jumlah)) ? '' : tugas.jumlah}
                                                onChange={(e) =>
                                                    handleTugasChange(index, 'jumlah', e.target.value)
                                                }
                                            />
                                        </div>
                                        <Input
                                            type="text"
                                            value={formatToRupiah(tugas.honor_per_tugas)}
                                            onChange={(e) =>
                                                handleTugasChange(index, 'honor_per_tugas', e.target.value)
                                            }
                                        />
                                    </>
                                )}

                                {(tugas.jenis_tugas === 'panitia') && (
                                    <div>
                                        <Label>Honor</Label>
                                        <Input
                                            type="text"
                                            value={formatToRupiah(tugas.honor_per_tugas)}
                                            onChange={(e) =>
                                                handleTugasChange(index, 'honor_per_tugas', e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeTugas(index)}
                                >
                                    Hapus Tugas
                                </Button>
                            </div>
                        ))}

                        <div className='flex justify-between'>
                            <Button type="button" onClick={addTugas}>
                                Tambah Tugas
                            </Button>
                            <Button variant="blue" type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
