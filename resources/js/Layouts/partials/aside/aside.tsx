import React, { PropsWithChildren } from 'react';
import { InertiaLinkProps, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { IconDashboard, IconSettings, IconPerson, IconBook, IconBookOpen } from '@irsyadadl/paranoid';
import { PageProps } from '@/types'; // Import your PageProps type

export function Aside() {
    // Use the PageProps interface to type the props from usePage
    const { auth } = usePage<PageProps>().props; // Explicitly typing the props

    return (
        <ul className='grid items-center bg px-4 text-lg font-medium lg:px-4 gap-2 py-4'>
            <AsideLink active={route().current('dashboard')} href={route('dashboard')}>
                <IconDashboard />
                <span>Dashboard</span>
            </AsideLink>
            {/* Tampilkan link berdasarkan role pengguna */}
            {auth.user.role === 'bendahara' ? (
                <>
                    <AsideLink href='/bendahara/menu1'>
                        <IconSettings />
                        <span>Menu Bendahara 1</span>
                    </AsideLink>
                    <AsideLink href='/bendahara/menu2'>
                        <IconPerson />
                        <span>Menu Bendahara 2</span>
                    </AsideLink>
                </>
            ) : auth.user.role === 'pengurus' ? (
                <>
                    <AsideLink active={route().current('pengurus.anggaran.index')} href={route('pengurus.anggaran.index')}>
                        <IconSettings />
                        <span>Anggaran</span>
                    </AsideLink>
                    <AsideLink active={route().current('pengurus.lpj.index')} href={route('pengurus.lpj.index')}>
                        <IconPerson />
                        <span>Laporan PJ</span>
                    </AsideLink>
                </>
            ) : (
                <>
                    {/* Add other roles if necessary */}
                    <AsideLink active={route().current('admin.anggaran.index')} href={route('admin.anggaran.index')}>
                        <IconBookOpen />
                        <span>Anggaran</span>
                    </AsideLink>
                    <AsideLink active={route().current('admin.lpj.index')} href={route('admin.lpj.index')}>
                        <IconBook />
                        <span>Laporan</span>
                    </AsideLink>
                    <AsideLink active={route().current('admin.user.index')} href={route('admin.user.index')}>
                        <IconPerson />
                        <span>Users</span>
                    </AsideLink>
                    
                </>
            )}
        </ul>
    );
}

interface AsideLinkProps extends InertiaLinkProps {
    className?: string;
    active?: boolean;
}

export function AsideLink({ className, active, ...props }: AsideLinkProps) {
    return (
        <li className='-mx-1'>
            <Link
                className={cn(
                    active ? 'text-foreground font-bold bg-slate-200' : 'text-muted-foreground',
                    'flex items-center [&>svg]:size-4 [&>svg]:stroke-[1.25] [&>svg]:mr-2 [&>svg]:-ml-1 hover:bg-slate-200 tracking-tight text-base hover:text-foreground px-4 py-2 rounded-xl'
                )}
                {...props}
            />
        </li>
    );
}

export function AsideLabel({ children, className }: PropsWithChildren<{ className?: string }>) {
    return (
        <li className='-mx-4'>
            <span
                className={cn(
                    'flex items-center text-muted-foreground [&>svg]:w-4 [&>svg]:stroke-[1.25] [&>svg]:h-4 [&>svg]:mr-3 tracking-tight text-sm px-4 py-2 rounded-md',
                    className
                )}
            >
                {children}
            </span>
        </li>
    );
}
