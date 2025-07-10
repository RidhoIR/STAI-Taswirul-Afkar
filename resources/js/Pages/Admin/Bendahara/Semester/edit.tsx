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
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { BsPencilSquare } from "react-icons/bs";
import { Semester, User } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface EditUserProps {
    semesters: Semester;
}

const Edit = ({ semesters }: EditUserProps) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        semester: semesters.semester,
        tahun_ajaran: semesters.tahun_ajaran,
        tanggal_mulai: semesters.tanggal_mulai,
        tanggal_selesai: semesters.tanggal_selesai,
    });

    useEffect(() => {
        setData({
            semester: semesters.semester,
            tahun_ajaran: semesters.tahun_ajaran,
            tanggal_mulai: semesters.tanggal_mulai,
            tanggal_selesai: semesters.tanggal_selesai,
        });
    }, [semesters]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.bendahara.semester.update", semesters.id), {
            onSuccess: () => setOpen(false),
        });
    };

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

    return (
        <div>
            {/* Dialog and form for editing semester */}
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
                            Make changes to the semester's information.
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
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
