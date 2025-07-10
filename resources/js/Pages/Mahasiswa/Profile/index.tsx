import AdminLayout from '@/Layouts/AdminLayout'
import { Mahasiswa, PageProps, User } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
// import { column } from './partials/column';
import { DataTable } from '@/Components/DataTable';
import SectionTitle from '@/Components/section-title';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/Components/ui/dialog";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Camera, Eye } from "lucide-react"
import { Button } from '@/Components/ui/button';
import { IconPersonAdd } from '@irsyadadl/paranoid';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Mail, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import TestLayout from '@/Layouts/TestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import UpdatePasswordForm from './partials/UpdatePasswordForm';
import { SwitchCamera } from 'lucide-react'


interface MahasiswaProps {
    mahasiswa: Mahasiswa;
}

const index = ({ mahasiswa }: MahasiswaProps) => {
    const flash = usePage<PageProps>().props.flash;
    console.log(flash.success);
    console.log(mahasiswa);
    const [open, setOpen] = useState(false);

    const { data, setData, reset, post, errors, processing } = useForm<{
        foto: File | null;
        name: string;
        nim: string;
        email: string;
        tahun_masuk: string;
        prodi: string;
    }>({
        foto: null,
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        email: mahasiswa.email,
        tahun_masuk: mahasiswa.tahun_masuk,
        prodi: mahasiswa.prodi,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(false);
        post(route('admin.user.store'));
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false); // untuk preview modal

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setSelectedFile(file);               // untuk kontrol tombol simpan

            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('mahasiswa.uploadFoto'), {
            forceFormData: true,
            onSuccess: () => {
                setPreview(null);
                setSelectedFile(null);
                reset('foto'); // reset file
            },
        });
    };

    return (
        <TestLayout>
            <Head title='Profile' />
            <Card className="overflow-hidden">
                <div className="bg-slate-400 h-48 relative">
                    <div className="absolute -bottom-16 left-6 md:left-10">
                        <div className="relative w-24 h-24 md:w-32 md:h-32">
                            {/* Preview Modal */}
                            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                                <DialogTrigger asChild>
                                    <div className="w-full h-full rounded-full overflow-hidden cursor-pointer">
                                        <Avatar className="w-full h-full rounded-full">
                                            <AvatarImage
                                                src={preview || `/storage/${mahasiswa.foto}`}
                                                alt={mahasiswa.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Avatar>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
                                    <img
                                        src={preview || `/storage/${mahasiswa.foto}`}
                                        alt="Preview"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </DialogContent>
                            </Dialog>

                            {/* Icon Ganti Foto */}
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition"
                                title="Ganti Foto"
                                onClick={(e) => e.stopPropagation()} // Supaya tidak trigger modal preview
                            >
                                <Camera className="w-6 h-6 text-gray-600" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    name="foto"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Tombol Simpan Foto */}
                        {selectedFile && (
                            <form onSubmit={handleUpload} encType="multipart/form-data" className="mt-4">
                                <Button type="submit" disabled={processing}>
                                    Simpan Foto
                                </Button>
                            </form>
                        )}

                    </div>
                </div>
                <CardContent className="pt-20 pb-6 px-6">
                    <h2 className="text-2xl font-bold">{data.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{data.email}</span>
                    </div>
                </CardContent>
            </Card>
            {/* <Card className="w-full h-auto">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center'>
                        <Avatar className="h-48 w-48 rounded-lg">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt={data.name}
                            />
                            <AvatarFallback className="rounded-lg">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold">{data.name}</h2>
                            <p className="text-lg text-gray-500">{data.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-4'>
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="name"
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tahun_masuk" value="Tahun Masuk" />
                                    <TextInput
                                        id="tahun_masuk"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.tahun_masuk}
                                        onChange={(e) => setData('tahun_masuk', e.target.value)}
                                        required
                                        autoComplete="tahun_masuk"
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.tahun_masuk} />
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <InputLabel htmlFor="nim" value="NIM" />
                                    <TextInput
                                        id="nim"
                                        className="mt-1 block w-full"
                                        value={data.nim}
                                        onChange={(e) => setData('nim', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="nim"
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.nim} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="prodi" value="Prodi" />
                                    <TextInput
                                        id="prodi"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.prodi}
                                        onChange={(e) => setData('prodi', e.target.value)}
                                        required
                                        autoComplete="prodi"
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.prodi} />
                                </div>
                            </div>
                        </div>
                        {/* <UpdatePasswordForm className="max-w-xl" /> */}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Ubah Kata Sandi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='gap-4'>
                        <UpdatePasswordForm className="max-w-full" />
                    </div>
                </CardContent>
            </Card>
            {/* <DataTable data={mahasiswa} columns={column} /> */}
        </TestLayout >
    )
}
export default index; 
