import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from '@/Components/ui/input';

interface EditAnggaranProps {
    anggaran: any;
}

const Edit = ({ anggaran }: EditAnggaranProps) => {
    const [open, setOpen] = useState(false)
    const { put, data, setData, processing, errors, reset } = useForm({
        status_anggaran: anggaran.status_anggaran,
        keterangan: anggaran.keterangan,
        jumlah_anggaran_disetujui: anggaran.jumlah_anggaran_disetujui,
        tgl_pencairan: anggaran.tgl_pencairan,
        status_pencairan: anggaran.status_pencairan,
    });

    const formatRupiah = (value: string | null | undefined) => {
        if (!value) return 'Rp. '; // Return default if value is null or undefined

        const numberString = value.replace(/[^,\d]/g, '').toString(); // Remove all non-digit characters
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    useEffect(() => {
        setData({
            status_anggaran: anggaran.status_anggaran,
            keterangan: anggaran.keterangan,
            jumlah_anggaran_disetujui: anggaran.jumlah_anggaran_disetujui,
            tgl_pencairan: anggaran.tgl_pencairan,
            status_pencairan: anggaran.status_pencairan,
        });
    }, [anggaran]);

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

    const handleJumlahAnggaranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
        setData('jumlah_anggaran_disetujui', value); // Simpan nilai asli (hanya angka)
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.anggaran.update", anggaran.id), {
            onSuccess: () => setOpen(false),
        });
    };


    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="blue">
                        <BsPencilSquare />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Anggaran</DialogTitle>
                        <DialogDescription>
                            Ubah informasi perihal dan file anggaran.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="status_anggaran">Status Anggaran</Label>
                                <Select
                                    value={data.status_anggaran}
                                    onValueChange={(value) => setData('status_anggaran', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status Anggaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="disetujui">Disetujui</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status_anggaran && <p className="text-red-600">{errors.status_anggaran}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="status_pencairan">Status Pencairan</Label>
                                <Select
                                    value={data.status_pencairan}
                                    onValueChange={(value) => setData('status_pencairan', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status Anggaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="belum">Belum</SelectItem>
                                        <SelectItem value="sudah">Sudah</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status_pencairan && <p className="text-red-600">{errors.status_pencairan}</p>}
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='jumlah_anggaran_disetujui'>Jumlah Anggaran Disetujui</Label>
                                <Input
                                    id='jumlah_anggaran_disetujui'
                                    type='text'
                                    value={formatRupiah(data.jumlah_anggaran_disetujui)} // Tampilkan nilai terformat dengan awalan Rp
                                    onChange={handleJumlahAnggaranChange} // Tangani perubahan input
                                    required
                                />
                                {errors.jumlah_anggaran_disetujui && <p className='text-red-500'>{errors.jumlah_anggaran_disetujui}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tgl_pencairan">Tanggal Pencairan</Label>
                                <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !data.tgl_pencairan &&
                                                "text-muted-foreground"
                                            )}
                                        >
                                            {data.tgl_pencairan
                                                ? format(
                                                    new Date(data.tgl_pencairan),
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
                                                data.tgl_pencairan
                                                    ? new Date(data.tgl_pencairan)
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                handleDateSelect("tgl_pencairan", date)
                                            }

                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                />
                                {errors.keterangan && <p className="text-red-600">{errors.keterangan}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
