import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: { mustVerifyEmail: boolean, status?: string, className?: string }) {
    const user = usePage<PageProps>().props.auth.user;
    

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        jabatan: user.jabatan,
        niy: user.niy,
        nidn: user.nidn,
        ijazah_terakhir: user.ijazah_terakhir,
        tempat_lahir: user.tempat_lahir,
        tgl_lahir: user.tgl_lahir ? new Date(user.tgl_lahir).toISOString().split("T")[0] : "",
        alamat: user.alamat,
        no_telp: user.no_telp,
        role: user.role
        // foto: null as File | null, // Pastikan foto bisa berupa File atau null
    });

    const submit: FormEventHandler = (e) => {
        console.log(data);
        e.preventDefault();

        patch(route('profile.update'));
    };


    return (


        <section className={className}>
            {/* <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header> */}

            <form onSubmit={submit} className="mt-6" encType='multipart/form-data'>
                <div className='grid grid-cols-2 gap-4'>
                    {/* col 1 */}
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
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                        <div>
                            <InputLabel htmlFor="jabatan" value="Jabatan" />
                            <TextInput
                                id="jabatan"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.jabatan}
                                onChange={(e) => setData('jabatan', e.target.value)}
                                required
                                autoComplete="jabatan"
                            />
                            <InputError className="mt-2" message={errors.jabatan} />
                        </div>
                        <div>
                            <InputLabel htmlFor="niy" value="NIY" />
                            <TextInput
                                id="niy"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.niy}
                                onChange={(e) => setData('niy', e.target.value)}
                                required
                                autoComplete="niy"
                            />
                            <InputError className="mt-2" message={errors.niy} />
                        </div>
                        <div>
                            <InputLabel htmlFor="nidn" value="NIDN" />
                            <TextInput
                                id="nidn"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.nidn}
                                onChange={(e) => setData('nidn', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.nidn} />
                        </div>
                    </div>

                    {/* col 2 */}
                    <div className='space-y-4'>
                        <div>
                            <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                            <TextInput
                                id="tempat_lahir"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.tempat_lahir}
                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                required
                                autoComplete="tempat_lahir"
                            />
                            <InputError className="mt-2" message={errors.tempat_lahir} />
                        </div>
                        <div>
                            <InputLabel htmlFor="tgl_lahir" value="Tanggal Lahir" />
                            <TextInput
                                id="tgl_lahir"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.tgl_lahir}
                                onChange={(e) => setData('tgl_lahir', e.target.value)}
                                required
                                autoComplete="tgl_lahir"
                            />
                            <InputError className="mt-2" message={errors.tempat_lahir} />
                        </div>
                        <div>
                            <InputLabel htmlFor="alamat" value="Alamat" />
                            <TextInput
                                id="alamat"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                required
                                autoComplete="alamat"
                            />
                            <InputError className="mt-2" message={errors.alamat} />
                        </div>
                        <div>
                            <InputLabel htmlFor="no_telp" value="No Telp" />
                            <TextInput
                                id="no_telp"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.no_telp}
                                onChange={(e) => setData('no_telp', e.target.value)}
                                required
                                autoComplete="no_telp"
                            />
                            <InputError className="mt-2" message={errors.no_telp} />
                        </div>
                        <div>
                            <InputLabel htmlFor="ijazah_terakhir" value="Ijazah Terakhir" />
                            <TextInput
                                id="ijazah_terakhir"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.ijazah_terakhir}
                                onChange={(e) => setData('ijazah_terakhir', e.target.value)}
                                required
                                autoComplete="ijazah_terakhir"
                            />
                            <InputError className="mt-2" message={errors.ijazah_terakhir} />
                        </div>
                        {/* <div>
                            <InputLabel htmlFor="role" value="Role" />
                            <TextInput
                                id="role"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                autoComplete="role"
                                disabled
                            />
                            <InputError className="mt-2" message={errors.role} />
                        </div> */}
                        {/* <div>
                            <InputLabel htmlFor="foto" value="Foto" />
                            <TextInput
                                id="foto"
                                type="file"
                                className="mt-1 block w-full"
                                onChange={e => setData('foto', e.target.files?.[0] || null)}  // Capture file
                                required
                                autoComplete="foto"
                            />
                            <InputError className="mt-2" message={errors.foto} />
                        </div> */}
                    </div>

                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center mt-4">
                        <PrimaryButton disabled={processing} className='w-full h-10 text-center items-center justify-center'>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
