import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import TestLayout from '@/Layouts/TestLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";


export default function Edit({ auth, mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean, status?: string }>) {
    const name = auth.user ? auth.user.name : auth.mahasiswa ? auth.mahasiswa.name : 'User';
    const email = auth.user ? auth.user.email : auth.mahasiswa ? auth.mahasiswa.email : 'email tidak ada';
    return (
        <TestLayout
        // user={auth.user}
        // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center'>
                        <Avatar className="h-48 w-48 rounded-lg">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt={name}
                            />
                            <AvatarFallback className="rounded-lg">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold">{name}</h2>
                            <p className="text-lg text-gray-500">{email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='gap-4'>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-full"
                        />
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

            <div>
                <div className=" sm:px-6 space-y-6">
                    {/* <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div> */}

                    {/* <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div> */}
                </div>
            </div>
        </TestLayout>
    );
}
