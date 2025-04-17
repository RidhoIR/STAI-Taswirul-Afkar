import React, { useEffect, useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Anggaran, Lpj, PageProps } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';


interface EditLpjProps {
    lpj: Lpj;
}

const Edit = ({ lpj }: EditLpjProps) => {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm<{
        id_anggaran: string;
        file_laporan: File | null;
        file_dokumentasi: File | null;
        narasi: string;
    }>({
        id_anggaran: lpj.anggaran.id.toString(),
        file_laporan: null,
        file_dokumentasi: null,
        narasi: lpj.narasi,
    });

    useEffect(() => {
        setData({
            id_anggaran: lpj.anggaran.id.toString(),
            file_laporan: null,
            file_dokumentasi: null,
            narasi: lpj.narasi,
        });
    }, [lpj]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('pengurus.lpj.update', lpj.id), {
            onSuccess: () => setOpen(false),
        });
    };

    const { anggarans } = usePage<PageProps>().props;

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
                        <DialogTitle>Edit LPJ</DialogTitle>
                        <DialogDescription>
                            Ubah informasi LPJ Anda di sini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            {/* Select Anggaran */}
                            <div>
                                <Label htmlFor='id_anggaran'>Anggaran</Label>
                                <Select
                                    value={data.id_anggaran}
                                    onValueChange={(value) => setData('id_anggaran', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Anggaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {anggarans.map((anggaran) => (
                                            <SelectItem key={anggaran.id} value={anggaran.id.toString()}>
                                                {anggaran.perihal}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_anggaran && <p className="text-red-600">{errors.id_anggaran}</p>}
                            </div>

                            {/* File Laporan */}
                            <div>
                                <Label htmlFor="file_laporan">File Laporan (PDF/Word)</Label>
                                <Input
                                    type="file"
                                    id="file_laporan"
                                    onChange={e => {
                                        const file = e.target.files?.[0] || null;
                                        setData('file_laporan', file);
                                    }}
                                />
                                {errors.file_laporan && <p className="text-red-500">{errors.file_laporan}</p>}
                            </div>

                            {/* File Dokumentasi */}
                            <div>
                                <Label htmlFor="file_dokumentasi">File Dokumentasi (PDF/Word)</Label>
                                <Input
                                    type="file"
                                    id="file_dokumentasi"
                                    onChange={e => {
                                        const file = e.target.files?.[0] || null;
                                        setData('file_dokumentasi', file);
                                    }}
                                />
                                {errors.file_dokumentasi && <p className="text-red-500">{errors.file_dokumentasi}</p>}
                            </div>

                            {/* Narasi */}
                            <div>
                                <Label htmlFor="narasi">Narasi</Label>
                                <Input
                                    type="text"
                                    id="narasi"
                                    value={data.narasi}
                                    onChange={e => setData('narasi', e.target.value)}
                                />
                                {errors.narasi && <p className="text-red-500">{errors.narasi}</p>}
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
