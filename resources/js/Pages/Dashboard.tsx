import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent } from '@/Components/ui/card';
import SectionTitle from '@/Components/section-title';
import TestLayout from "@/Layouts/TestLayout";

export default function Dashboard({ auth }: PageProps) {
    // Periksa apakah mahasiswa atau user yang sedang login dan ambil nama yang sesuai
    const name = auth.user ? auth.user.name : auth.mahasiswa ? auth.mahasiswa.name : 'User';

    return (
        <TestLayout>
            <Head title='Dashboard' />
            <Card>
                <SectionTitle title='Dashboard' description={`Hi ${name}, you are now logged in.`} />
                <CardContent>
                    Hi {name}, you are now logged in.
                    <div className='mb-2 text-muted-foreground'>// The page you are currently visiting is</div>
                    <div className='text-lime-600 dark:text-lime-400'>"resources/js/Pages/Dashboard.tsx"</div>
                </CardContent>
            </Card>
        </TestLayout>
    );
}
