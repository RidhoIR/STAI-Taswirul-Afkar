export interface User {
    id: number;
    name: string;
    email: string;
    jabatan: string;
    niy: string;
    nidn: string;
    tempat_lahir: string;
    tgl_lahir: Date;
    alamat: string;
    no_telp: string;
    ijazah_terakhir: string;
    foto: string;
    role: string;
    email_verified_at: string;
}

export interface Tridharma {
    id: number;
    nama: string;
}

export interface Semester {
    id: number;
    tahun_ajaran: string;
    semester: string;
    tanggal_mulai: Date;
    tanggal_selesai: Date;
}

export interface Mahasiswa {
    id: number;
    foto: string;
    semester: Semester;
    tahun_masuk: string;
    prodi: string;
    name: string;
    email: string;
    nim: string;
    no_telp: string;
    jenis_mahasiswa: string;
    status: string;
}

export interface Jenis_pembayaran {
    id: number;
    nama_pembayaran: string;
    is_once: boolean;
    jumlah: string;
}

export interface Jabatan {
    id: number;
    name: string;
    honor: number;
}

export interface Transaksi {
    id: number;
    no_invoice: string;
    user: User;
    mahasiswa: Mahasiswa;
    jenis_pembayaran: Jenis_pembayaran; // Ubah jadi jenis_pembayaran
    semester: Semester;
    detail_jenis_pembayaran: DetailJenisPembayaran;
    deskripsi: string;
    jumlah: number;
    tanggal_pembayaran: Date;
    created_at: timestamp;
}

export interface Anggaran {
    id: number;
    perihal: string;
    tridharma: Tridharma;
    anggaran: string;
    user_id: User;
    user: User;
    jumlah_anggaran: string;
    jumlah_anggaran_disetujui: string;
    tgl_disetujui: Date;
    tgl_pencairan: Date;
    tgl_pengajuan: Date;
    status_pencairan: string;
    keterangan: string;
    status_anggaran: string;
    file_url: string;
}

export interface TanggunganPembayaran {
    id: number;
    mahasiswa: Mahasiswa;
    detail_jenis_pembayaran: DetailJenisPembayaran;
    semester: Semester;
    sisa_pembayaran: number;
    total_dibayar: number;
    jumlah: string;
    status: string;
}

export interface DetailJenisPembayaran {
    id: number;
    semester: Semester;
    jenis_pembayaran: Jenis_pembayaran;
    jumlah: string;
}

export interface Lpj {
    id: number;
    anggaran: Anggaran;
    file_laporan: string;
    foto_dokumentasi: string;
    narasi: string;
}

export interface Honorarium {
    id: number;
    jabatan: Jabatan;
    name: string;
    periode: Date;
    jumlah_mk: number;
    honor_mk: number;
    lain_lain: number;
    jumlah: number;
}

export interface HonorSkripsi {
    id: number;
    semester: Semester;
    nama: string;
    tanggal: Date;
    tugas: HonorSkripsiTugas[];
}

export interface HonorSkripsiTugas {
    id: number;
    honor_skripsi: HonorSkripsi;
    jenis_tugas: string;
    jumlah: number;
    honor_per_tugas: number;
    honor_total: number;
}

export interface HonorProposal {
    id: number;
    semester: Semester;
    nama: string;
    tanggal: Date;
    tugas: HonorProposalTugas[];
}

export interface HonorProposalTugas {
    id: number;
    honor_proposal: HonorProposal;
    jenis_tugas: string;
    jumlah: number;
    honor_per_tugas: number;
    honor_total: number;
}

export interface HonorPPL {
    id: number;
    semester: Semester;
    nama: string;
    tanggal: Date;
    tugas: HonorPPLTugas[];
}

export interface HonorPPLTugas {
    id: number;
    honor_ppl: HonorPPL;
    jenis_tugas: string;
    jumlah: number;
    honor_per_tugas: number;
    honor_total: number;
}

export interface HonorWisuda {
    id: number;
    nama: string;
    tugas: string;
    tanggal: Date;
    honor_per_tugas: number;
    honor_total: number;
}

export interface HonorUjian {
    id: number;
    semester: Semester;
    nama: string;
    tanggal: Date;
    tugas: HonorUjianTugas[];
}

export interface HonorUjianTugas {
    id: number;
    honor_ujian: HonorUjian;
    jenis_tugas: string;
    jumlah: number;
    honor_per_tugas: number;
    honor_total: number;
    tipe_ujian: string;
}


export interface TransaksiHarian {
    id: number;
    user: User;
    tanggal: Date;
    deskripsi: string;
    jenis: string;
    jumlah: number;
}

export interface Laporan {
    id: number;
    periode_awal: string; // ISO Date (e.g., "2025-01-01")
    periode_akhir: string;
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo_awal: number;
    saldo_akhir: number;
    detail_laporans: DetailLaporan[]; // Optional: jika kamu include relasinya
}

export interface DetailLaporan {
    id: number;
    laporan_id: number;
    jenis: string;
    sumber: string;
    jumlah: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        mahasiswa: Mahasiswa;
    };
    flash: {
        success: string;
        error: string;
    };
    anggarans: Anggaran[];
    lpj: Lpj[];
    tridharmas: Tridharma[];
    semesters: Semester[];
    jenis_pembayaran: Jenis_pembayaran[];
    mahasiswa: Mahasiswa[];
    transaksi: Transaksi[];
    tanggungan_pembayaran: TanggunganPembayaran[];
    detail_jenis_pembayaran: DetailJenisPembayaran[];
    Honorarium: Honorarium[];
    HonorSkripsi: HonorSkripsi[];
    HonorUjian: HonorUjian[];
    TransaksiHarian: TransaksiHarian[];
    Laporan: Laporan[];
    DetailLaporan: DetailLaporan[];
    HonorPPL: HonorPPL[];
    HonorWisuda: HonorWisuda[];
    jabatan: Jabatan[];
    HonorSkripsiTugas: HonorSkripsiTugas[];
    HonorProposal: HonorProposal[];
    HonorProposalTugas: HonorProposalTugas[];
    HonorUjianTugas: HonorUjianTugas[];
};