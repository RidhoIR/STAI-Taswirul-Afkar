<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mahasiswa::create([
            'name' => 'Ahmad Fauzan',
            'nim' => '220101001',
            'email' => 'ahmad@gmail.com',
            'prodi' => 'Pendidikan Agama Islam',
            'tahun_masuk' => '2022',
            'password' => Hash::make('123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Mahasiswa::create([
            'name' => 'Soekarno',
            'nim' => '220101002',
            'email' => 'soekarno@gmail.com',
            'prodi' => 'Pendidikan Agama Islam',
            'tahun_masuk' => '2022',
            'password' => Hash::make('123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
