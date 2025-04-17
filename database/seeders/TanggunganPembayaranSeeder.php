<?php

namespace Database\Seeders;

use App\Models\JenisPembayaran;
use App\Models\Mahasiswa;
use App\Models\Semester;
use App\Models\TanggunganPembayaran;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TanggunganPembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = Semester::all();
        $jenisPembayarans = JenisPembayaran::all();
        $mahasiswas = Mahasiswa::all();

        foreach ($semesters as $semester) {
            foreach ($mahasiswas as $mahasiswa) {
                foreach ($jenisPembayarans as $jenis) {
                    TanggunganPembayaran::firstOrCreate([
                        'mahasiswa_id' => $mahasiswa->id,
                        'jenis_pembayaran_id' => $jenis->id,
                        'semester_id' => $semester->id,
                    ], [
                        'jumlah' => $jenis->jumlah,
                        'status' => 'belum_bayar',
                    ]);
                }
            }
        }
    }
}
