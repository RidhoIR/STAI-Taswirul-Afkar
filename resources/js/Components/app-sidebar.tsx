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
                    url: route("admin.dashboard"),
                    isActive: route().current("admin.dashboard"),
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
                {
                    title: "Mahasiswa",
                    url: route("pengurus.mahasiswa.index"),
                    isActive: route().current("pengurus.mahasiswa.index"),
                    icon: Command,
                },
            ];
        } else if (auth.user.role === "bendahara") {
            navMain = [
                {
                    title: "Dashboard",
                    url: route("bendahara.dashboard"),
                    isActive: route().current("bendahara.dashboard"),
                    icon: SquareTerminal,
                },
                {
                    title: "Semester",
                    url: route("admin.bendahara.semester.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.semester.index"),
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
                {
                    title: "Honor Jabatan",
                    url: route("admin.bendahara.honor-jabatan.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-jabatan.*"),
                },
                {
                    title: "Honor Dosen & Pegawai",
                    url: route("admin.bendahara.honorarium.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honorarium.*"),
                },
                {
                    title: "Honorarium Skripsi",
                    url: route("admin.bendahara.honor-skripsi.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-skripsi.*"),
                },
                {
                    title: "Honorarium Proposal",
                    url: route("admin.bendahara.honor-proposal.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-proposal.*"),
                },
                {
                    title: "Honorarium Ujian",
                    url: '#',
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-ujian.*"),
                    items: [
                        {
                            title: "UTS",
                            url: route("admin.bendahara.honor-ujian.uts.index"),
                            isActive: route().current("admin.bendahara.honor-ujian.uts.*"),
                        },
                        {
                            title: "UAS",
                            url: route("admin.bendahara.honor-ujian.uas.index"),
                            isActive: route().current("admin.bendahara.honor-ujian.uas.*"),
                        }
                    ]
                },
                {
                    title: "Honorarium PPL/KKN",
                    url: route("admin.bendahara.honor-ppl.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-ppl.*"),
                },
                {
                    title: "Honorarium Wisuda",
                    url: route("admin.bendahara.honor-wisuda.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.honor-wisuda.*"),
                },
                {
                    title: "Transaksi Harian",
                    url: "#",
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.transaksi-harian.*"),
                    items: [
                        {
                            title: "Pengeluaran",
                            url: route("admin.bendahara.transaksi-harian.pengeluaran.index"),
                            isActive: route().current("admin.bendahara.transaksi-harian.pengeluaran.*"),
                        },
                        {
                            title: "Pemasukan",
                            url: route("admin.bendahara.transaksi-harian.pemasukan.index"),
                            isActive: route().current("admin.bendahara.transaksi-harian.pemasukan.*"),
                        },
                    ]
                },
                {
                    title: "Laporan Keuangan",
                    url: route("admin.bendahara.laporan.index"),
                    icon: Annoyed,
                    isActive: route().current("admin.bendahara.laporan.index"),
                },
            ];
        } else if (auth.user.role === "pengurus") {
            navMain = [
                {
                    title: "Dashboard",
                    url: route("dashboard.dosen"),
                    isActive: route().current("dashboard.dosen"),
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
            ];
        }
    }
    // Sidebar untuk auth:mahasiswa
    else if (auth?.mahasiswa) {
        navMain = [
            {
                title: "Dashboard",
                url: route("mahasiswa.dashboard"),
                isActive: route().current("mahasiswa.dashboard"),
                icon: SquareTerminal,
            },
            {
                title: "Profile",
                url: route("mahasiswa.profile.index"),
                isActive: route().current("mahasiswa.profile.index"),
                icon: SquareTerminal,
            },
            {
                title: "Transaksi",
                url: route("mahasiswa.transaksi.index"),
                isActive: route().current("mahasiswa.transaksi.index"),
                icon: SquareTerminal,
            },
            {
                title: "Tanggungan Pembayaran",
                url: route("mahasiswa.tanggungan-pembayaran.index"),
                isActive: route().current("mahasiswa.tanggungan-pembayaran.index"),
                icon: FileText,
            },
            {
                title: "Kartu Ujian",
                url: route("mahasiswa.kartu-ujian.index"),
                isActive: route().current("mahasiswa.kartu-ujian.index"),
                icon: FileText,
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