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

export interface Semester{
    id: number;
    tahun_ajaran: string;
    semester: string;
    tanggal_mulai: Date;
    tanggal_selesai: Date;
}

export interface Mahasiswa{
    id: number;
    semester: Semester;
    tahun_masuk: string;
    prodi: string;
    name: string;
    email: string;
    nim:string;
    status:string;
}

export interface Jenis_pembayaran{
    id: number;
    nama_pembayaran : string;
    jumlah: string;
}

export interface Transaksi  {
    id: number;
    no_invoice: string;
    user: User;
    mahasiswa: Mahasiswa;
    jenis_pembayaran: Jenis_pembayaran; // Ubah jadi jenis_pembayaran
    semester: Semester;
    deskripsi: string;
    jumlah: number;
    tanggal_pembayaran: Date;
    created_at: timestamp;
}

export interface Anggaran{
    id: number;
    perihal: string;
    tridharma_id: Tridharma;
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

export interface TanggunganPembayaran{
    id: number;
    mahasiswa: Mahasiswa;
    jenis_pembayaran: Jenis_pembayaran;
    semester: Semester;
    jumlah: string;
    status:string;
}

export interface JenisPembayaranSemester{
    id: number;
    semester: Semester;
    jenis_pembayaran: Jenis_pembayaran;
    jumlah: string;
}

export interface Lpj{
    id: number;
    anggaran: Anggaran;
    file_laporan: string;
    foto_dokumentasi: string;
    narasi: string;
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
    anggarans:Anggaran[];
    lpj:Lpj[];
    tridharmas:Tridharma[];
    semesters:Semester[];
    jenis_pembayaran:Jenis_pembayaran[];
    mahasiswa:Mahasiswa[];
    transaksi:Transaksi[];
    tanggungan_pembayaran:TanggunganPembayaran[];
    jenis_pembayaran_semester:JenisPembayaranSemester[];
};