<?php

namespace Database\Seeders;

use App\Models\Honorarium;
use Illuminate\Database\Seeder;

class HonorariumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Dr. Budi Santoso',
                'jabatan' => 'Dosen Tetap',
                'periode' => '2025-03-01',
                'jumlah_mk' => 3,
                'honor_mk' => 750000,
                'lain_lain' => 'Koordinator Prodi',
                'jumlah' => 3 * 750000,
            ],
            [
                'name' => 'Prof. Ani Lestari',
                'jabatan' => 'Guru Besar',
                'periode' => '2025-03-01',
                'jumlah_mk' => 2,
                'honor_mk' => 1000000,
                'lain_lain' => null,
                'jumlah' => 2 * 1000000,
            ],
            [
                'name' => 'Dr. Budi Santoso',
                'jabatan' => 'Dosen Tetap',
                'periode' => '2025-03-01',
                'jumlah_mk' => 3,
                'honor_mk' => 750000,
                'lain_lain' => 'Koordinator Prodi',
                'jumlah' => 3 * 750000,
            ],
        ];

        foreach ($data as $item) {
            Honorarium::create($item);
        }
    }
}
