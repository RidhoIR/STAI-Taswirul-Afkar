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
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Mahasiswa, User } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface EditMahasiswaProps {
    mahasiswas: Mahasiswa;
}


const Edit = ({ mahasiswas }: EditMahasiswaProps) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        name: mahasiswas.name,
        email: mahasiswas.email,
        nim: mahasiswas.nim,
        jenis_mahasiswa: mahasiswas.jenis_mahasiswa,
        no_telp: mahasiswas.no_telp ?? '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setData({
            name: mahasiswas.name,
            email: mahasiswas.email,
            jenis_mahasiswa: mahasiswas.jenis_mahasiswa,
            nim: mahasiswas.nim,
            no_telp: mahasiswas.no_telp ?? '',
            password: '',
            password_confirmation: '',
        });
    }, [mahasiswas]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("pengurus.mahasiswa.update", mahasiswas.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <div>
            {/* Dialog and form for editing user */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="blue">
                        <BsPencilSquare />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={e => setData('nim', e.target.value)}
                                />
                                {errors.nim && <p className="text-red-600">{errors.nim}</p>}
                            </div>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="jenis_mahasiswa">Jenis Mahasiswa</Label>
                                <Select
                                    value={data.jenis_mahasiswa}
                                    onValueChange={(value) => setData('jenis_mahasiswa', value)}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Jenis Mahasiswa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reguler">Reguler</SelectItem>
                                        <SelectItem value="beasiswa">Beasiswa</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_mahasiswa && <p className="text-red-600">{errors.jenis_mahasiswa}</p>}
                            </div>
                            <div>
                                <Label htmlFor="no_telp">No. Telepon</Label>
                                <Input
                                    id="no_telp"
                                    type="text"
                                    value={data.no_telp}
                                    onChange={e => setData('no_telp', e.target.value)}
                                />
                                {errors.no_telp && <p className="text-red-600">{errors.no_telp}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                                {errors.password_confirmation && <span>{errors.password_confirmation}</span>}
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
