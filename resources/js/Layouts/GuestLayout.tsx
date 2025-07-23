import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface GuestProps extends PropsWithChildren {
    title?: string; // optional, or remove `?` if it's required
}

export default function Guest({ children, title }: GuestProps) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <div className='flex justify-center mb-2'>
                    <ApplicationLogo className="h-32 w-32 fill-current text-gray-500" />
                </div>
                <div className='text-center font-bold uppercase'>
                    {title}
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
