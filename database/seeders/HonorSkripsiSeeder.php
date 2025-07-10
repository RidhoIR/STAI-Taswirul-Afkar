<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HonorSkripsi;

class HonorSkripsiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'semester_id' => 1,
                'nama' => 'Dr. Ahmad Surya',
                'tugas' => 'Pembimbing',
                'tanggal' => '2025-04-01',
                'jumlah' => 500000,
            ],
            [
                'semester_id' => 1,
                'nama' => 'Prof. Lilis Hidayati',
                'tugas' => 'Penguji',
                'tanggal' => '2025-04-01',
                'jumlah' => 450000,
            ],
            [
                'semester_id' => 1,
                'nama' => 'Drs. Bambang Wijaya',
                'tugas' => 'Panitia',
                'tanggal' => '2025-05-01',
                'jumlah' => 300000,
            ],
            [
                'semester_id' => 1,
                'nama' => 'Dr. Fitri Handayani',
                'tugas' => 'Sekretaris',
                'tanggal' => '2025-05-01',
                'jumlah' => 350000,
            ],
        ];

        foreach ($data as $item) {
            HonorSkripsi::create($item);
        }
    }
}
