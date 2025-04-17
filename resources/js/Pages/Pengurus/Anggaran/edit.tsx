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
import { Anggaran, PageProps } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface EditAnggaranProps {
    anggaran: Anggaran;
}

const Edit = ({ anggaran }: EditAnggaranProps) => {
    const [open, setOpen] = useState(false);
    const { tridharmas } = usePage<PageProps>().props;

    const { data, setData, put, errors, processing } = useForm<{
        perihal: string;
        anggaran: File | null;
        jumlah_anggaran: string;
        tridharma_id: string;
    }>({
        tridharma_id: String(anggaran.tridharma_id),
        perihal: anggaran.perihal,
        anggaran: null,
        jumlah_anggaran: anggaran.jumlah_anggaran,
    });

    // Function to format Rupiah
    const formatRupiah = (value: string) => {
        let numberString = value.replace(/\D/g, '');
        let rupiah = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    // Handling jumlah anggaran input change
    const handleJumlahAnggaranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        setData('jumlah_anggaran', value);
    };

    useEffect(() => {
        setData({
            tridharma_id: String(anggaran.tridharma_id),
            perihal: anggaran.perihal,
            anggaran: null,
            jumlah_anggaran: anggaran.jumlah_anggaran,
        });
    }, [anggaran]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("pengurus.anggaran.update", anggaran.id), {
            onSuccess: () => setOpen(false),
            onError: (errors) => console.log("Form submission errors:", errors),
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
                            <div>
                                <Label htmlFor="perihal">Perihal</Label>
                                <Input
                                    id="perihal"
                                    value={data.perihal}
                                    onChange={e => setData('perihal', e.target.value)}
                                    required
                                />
                                {errors.perihal && <p className="text-red-600">{errors.perihal}</p>}
                            </div>
                            <div>
                                <Label htmlFor="tridharma_id">Tridharma</Label>
                                <Select
                                    value={data.tridharma_id}
                                    onValueChange={(value) => setData('tridharma_id', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Tridharma">
                                            {tridharmas.find(tridharma => tridharma.id === parseInt(data.tridharma_id))?.nama}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tridharmas.map((tridharma) => (
                                            <SelectItem key={tridharma.id} value={tridharma.id.toString()}>
                                                {tridharma.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tridharma_id && <p className="text-red-600">{errors.tridharma_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="jumlah_anggaran">Jumlah Anggaran</Label>
                                <Input
                                    type="text"
                                    id="jumlah_anggaran"
                                    value={formatRupiah(data.jumlah_anggaran)}
                                    onChange={handleJumlahAnggaranChange}
                                    required
                                />
                                {errors.jumlah_anggaran && <p className="text-red-600">{errors.jumlah_anggaran}</p>}
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="anggaran">File Anggaran (PDF/Word)</Label>
                                <Input
                                    type="file"
                                    id="anggaran"
                                    onChange={e => setData('anggaran', e.target.files?.[0] || null)}
                                />
                                {errors.anggaran && <p className="text-red-500">{errors.anggaran}</p>}
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
