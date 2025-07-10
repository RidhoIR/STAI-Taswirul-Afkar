import AdminLayout from '@/Layouts/AdminLayout'
import { Mahasiswa, PageProps, User } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import SectionTitle from '@/Components/section-title';
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
import { BsPencilSquare, BsPersonAdd } from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { IconPersonAdd } from '@irsyadadl/paranoid';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/Components/ui/card';
import TestLayout from '@/Layouts/TestLayout';
import { FaNimblr } from 'react-icons/fa';

interface MahasiswaProps {
    mahasiswas: Mahasiswa[];
}

const index = ({ mahasiswas }: MahasiswaProps) => {
    const flash = usePage<PageProps>().props.flash;
    console.log(flash.success);
    console.log(mahasiswas);
    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        nim: '',
        tahun_masuk: '',
        no_telp: '',
        jenis_mahasiswa: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengurus.mahasiswa.store'));
    };
    return (
        <TestLayout>
            <Head title='Mahasiswa' />
            <div>
                <div className='flex justify-between items-center flex-col md:flex-row mb-4'>
                    <h1 className='text-5xl font-sans font-bold'>Mahasiswa</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="blue" size="default">
                                <BsPersonAdd size={20} className='mr-2' /> Tambah Data
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='max-h-[90vh] overflow-y-auto'>
                            <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                    Make changes to the user's information.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submit}>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="nim">NIM<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="nim"
                                            value={data.nim}
                                            onChange={e => setData('nim', e.target.value)}
                                        />
                                        {errors.nim && <p className="text-red-600">{errors.nim}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="name">Nama<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="jenis_mahasiswa">Jenis Mahasiswa</Label>
                                        <Select
                                            value={data.jenis_mahasiswa}
                                            onValueChange={(value) => setData('jenis_mahasiswa', value)}
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
                                        <Label htmlFor="tahun_masuk">Tahun Masuk<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="tahun_masuk"
                                            type="text"
                                            value={data.tahun_masuk}
                                            onChange={e => setData('tahun_masuk', e.target.value)}
                                        />
                                        {errors.tahun_masuk && <p className="text-red-600">{errors.tahun_masuk}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="password">Password<span className='text-red-600'>*</span></Label>
                                        <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                        {errors.password && <span className='text-red-600'>{errors.password}</span>}
                                    </div>
                                    <div>
                                        <Label htmlFor="password_confirmation">Confirm Password<span className='text-red-600'>*</span></Label>
                                        <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                                        {errors.password_confirmation && <span>{errors.password_confirmation}</span>}
                                    </div>
                                    {/* <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                                <SelectItem value="bendahara">Bendahara</SelectItem>
                                                <SelectItem value="pengurus">Pengurus</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-red-600">{errors.role}</p>}
                                    </div> */}
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
                <hr className='border-t-2 border-gray-400' />
            </div>
            <DataTable data={mahasiswas} columns={column} />
        </TestLayout >
    )
}
export default index; 
