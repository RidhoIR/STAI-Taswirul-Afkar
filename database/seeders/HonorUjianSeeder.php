<?php

namespace Database\Seeders;

use App\Models\HonorUjian;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HonorUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'semester_id' => 1,
                'nama' => 'Dr. Ahmad Surya',
                'tugas' => 'Pembuat Soal',
                'jumlah' => 500000,
                'tanggal' => '2025-04-01',
                'tipe_ujian' => 'UTS',
            ],
            [
                'semester_id' => 1,
                'nama' => 'Prof. Lilis Hidayati',
                'tugas' => 'Korektor',
                'jumlah' => 450000,
                'tanggal' => '2025-04-01',
                'tipe_ujian' => 'UTS',

            ],
            [
                'semester_id' => 1,
                'nama' => 'Drs. Bambang Wijaya',
                'tugas' => 'Pengawas',
                'jumlah' => 300000,
                'tanggal' => '2025-04-01',
                'tipe_ujian' => 'UTS',

            ],
            [
                'semester_id' => 1,
                'nama' => 'Dr. Fitri Handayani',
                'tugas' => 'Panitia Ujian',
                'jumlah' => 350000,
                'tanggal' => '2025-05-01',
                'tipe_ujian' => 'UTS',
            ],
            [
                'semester_id' => 1,
                'nama' => 'Dr. Ahmad Surya',
                'tugas' => 'Pembuat Soal',
                'jumlah' => 500000,
                'tanggal' => '2025-05-01',
                'tipe_ujian' => 'UAS',
            ],
            [
                'semester_id' => 1,
                'nama' => 'Prof. Lilis Hidayati',
                'tugas' => 'Korektor',
                'jumlah' => 450000,
                'tanggal' => '2025-04-01',
                'tipe_ujian' => 'UAS',

            ],
            [
                'semester_id' => 1,
                'nama' => 'Drs. Bambang Wijaya',
                'tugas' => 'Pengawas',
                'jumlah' => 300000,
                'tanggal' => '2025-05-01',
                'tipe_ujian' => 'UAS',

            ],
            [
                'semester_id' => 1,
                'nama' => 'Dr. Fitri Handayani',
                'tugas' => 'Panitia Ujian',
                'jumlah' => 350000,
                'tanggal' => '2025-04-01',
                'tipe_ujian' => 'UAS',
            ],
        ];

        foreach ($data as $item) {
            HonorUjian::create($item);
        }
    }
}
