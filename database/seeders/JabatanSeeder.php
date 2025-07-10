<?php

namespace Database\Seeders;

use App\Models\Jabatan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JabatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jabatans = [
            [
                'name' => 'Ketua 1',
                'honor' => 4200000,
            ],
            [
                'name' => 'Wakil Ketua 1',
                'honor' => 2300000,
            ],
            [
                'name' => 'Wakil Ketua 2',
                'honor' => 2300000,
            ],
            [
                'name' => 'Sekretaris',
                'honor' => 1600000,
            ],
            [
                'name' => 'Kepala Prodi',
                'honor' => 2300000,
            ],
            [
                'name' => 'Ketua LPM',
                'honor' => 750000,
            ],
            [
                'name' => 'Ketua LP2M',
                'honor' => 750000,
            ],
            [
                'name' => 'Bendahara',
                'honor' => 2300000,
            ],
            [
                'name' => 'Ketua Yayasan',
                'honor' => 750000,
            ],
            [
                'name' => 'Operator',
                'honor' => 2000000,
            ],
        ];

        foreach ($jabatans as $jabatan) {
            Jabatan::create($jabatan);
        }
    }
}
