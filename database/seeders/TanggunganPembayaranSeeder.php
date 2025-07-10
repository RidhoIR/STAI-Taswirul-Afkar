<?php

namespace Database\Seeders;

use App\Models\JenisPembayaran;
use App\Models\DetailJenisPembayaran;
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
        $mahasiswas = Mahasiswa::all();
        $detailPembayarans = DetailJenisPembayaran::with('jenis_pembayaran')->get();

        foreach ($mahasiswas as $mahasiswa) {
            foreach ($detailPembayarans as $detail) {
                // Jika is_once dan mahasiswa sudah punya tanggungan jenis ini, skip
                if (
                    $detail->jenis_pembayaran->is_once &&
                    TanggunganPembayaran::where('mahasiswa_id', $mahasiswa->id)
                    ->where('detail_jenis_pembayaran_id', $detail->id)
                    ->exists()
                ) {
                    continue;
                }

                TanggunganPembayaran::firstOrCreate([
                    'mahasiswa_id' => $mahasiswa->id,
                    'detail_jenis_pembayaran_id' => $detail->id,
                ], [
                    'jumlah' => $detail->jumlah,
                    'status' => 'belum_bayar',
                ]);
            }
        }
    }
}
