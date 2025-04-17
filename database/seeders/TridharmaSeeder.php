<?php

namespace Database\Seeders;

use App\Models\Tridharma;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TridharmaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tridharma::create([
            'nama' => 'Pendidikan',
        ]);
        Tridharma::create([
            'nama' => 'Penelitian',
        ]);
        Tridharma::create([
            'nama' => 'Pengabdian Masyarakat',
        ]);
        Tridharma::create([
            'nama' => 'Investasi',
        ]);
        Tridharma::create([
            'nama' => 'Pengembangan Lembaga',
        ]);
    }
}
