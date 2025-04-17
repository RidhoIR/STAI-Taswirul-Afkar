import * as React from "react";
import {
    Annoyed,
    AudioWaveform,
    Bot,
    Command,
    FileText,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/Components/nav-main";
import { NavUser } from "@/Components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

// Interface untuk submenu
interface SubMenuItem {
    title: string;
    url: string;
    isActive?: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth, availableYears = [] } = usePage<PageProps & {
        availableYears?: number[]
    }>().props;

    if (!(auth?.user || auth?.mahasiswa)) return null;

    let navMain: {
        title: string;
        url: string;
        isActive: boolean;
        icon: any;
        items?: SubMenuItem[];
    }[] = [];

    // Sidebar untuk auth:user (admin, bendahara, pengurus)
    if (auth?.user) {
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const currentYear = urlParams.get('year') || new Date().getFullYear().toString();

        // Buat submenu untuk tahun-tahun yang tersedia
        // Jika availableYears kosong, gunakan 5 tahun terakhir sebagai fallback
        const years = availableYears.length > 0
            ? availableYears
            : [
                new Date().getFullYear(),
                new Date().getFullYear() + 1,
                new Date().getFullYear() + 2,
            ];

        const anggaranSubmenuItems = years.map(year => ({
            title: year.toString(),
            url: route("admin.anggaran.index", { year }),
            isActive: currentYear === year.toString() &&
                route().current("admin.anggaran.index", { year }),
        }));

        const anggaranSubmenuItems2 = years.map(year => ({
            title: year.toString(),
            url: route("pengurus.anggaran.index", { year }),
            isActive: currentYear === year.toString() &&
                route().current("pengurus.anggaran.index", { year }),
        }));
        if (auth.user.role === "admin") {
            // Dapatkan tahun saat ini dari URL
            navMain = [
                {
                    title: "Dashboard",
                    url: route("dashboard"),
                    isActive: route().current("dashboard"),
                    icon: SquareTerminal,
                },
                {
                    title: "Pengajuan Anggaran",
                    url: "#",
                    icon: Annoyed,
                    isActive: route().current("admin.anggaran.index"),
                    items: anggaranSubmenuItems,
                },
                {
                    title: "Laporan Pertanggungjawaban",
                    url: route("admin.lpj.index"),
                    isActive: route().current("admin.lpj.index"),
                    icon: Command,
                },
                {
                    title: "Kelola Users",
                    url: route("admin.user.index"),
                    isActive: route().current("admin.user.index"),
                    icon: Bot,
                },
            ];
        } else if (auth.user.role === "bendahara") {
            navMain = [
                {
                    title: "Dashboard",
                    url: route("dashboard"),
                    isActive: route().current("dashboard"),
                    icon: SquareTerminal,
                },
                {
                    title: "Riwayat Pembayaran",
                    url: route("admin.bendahara.riwayat-pembayaran.index"),
                    isActive: route().current("admin.bendahara.riwayat-pembayaran.*"),
                    icon: SquareTerminal,
                },
                {
                    title: "Daftar Mahasiswa",
                    url: route("admin.bendahara.mahasiswa.index"),
                    isActive: route().current("admin.bendahara.mahasiswa.index"),
                    icon: SquareTerminal,
                },
                {
                    title: "Jenis Pembayaran",
                    url: route("admin.bendahara.jenis-pembayaran.index"),
                    isActive: route().current("admin.bendahara.jenis-pembayaran.index"),
                    icon: SquareTerminal,
                },
                {
                    title: "Detail Jenis Pembayaran",
                    url: route("admin.bendahara.detail-jenis-pembayaran.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.detail-jenis-pembayaran.index"),
                },
            ];
        } else if (auth.user.role === "pengurus") {
            navMain = [
                {
                    title: "Dashboard",
                    url: route("dashboard"),
                    isActive: route().current("dashboard"),
                    icon: SquareTerminal,
                },
                {
                    title: "Pengajuan Anggaran",
                    url: "#",
                    icon: Annoyed,
                    isActive: route().current("pengurus.anggaran.index"),
                    items: anggaranSubmenuItems2,
                },
                {
                    title: "Laporan LPJ",
                    url: route("pengurus.lpj.index"),
                    isActive: route().current("pengurus.lpj.index"),
                    icon: FileText,
                },
                {
                    title: "Mahasiswa",
                    url: route("pengurus.mahasiswa.index"),
                    isActive: route().current("pengurus.mahasiswa.index"),
                    icon: Command,
                },
            ];
        }
    }
    // Sidebar untuk auth:mahasiswa
    else if (auth?.mahasiswa) {
        navMain = [
            {
                title: "Dashboard",
                url: route("dashboard"),
                isActive: route().current("dashboard"),
                icon: SquareTerminal,
            },
        ];
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}