<?php

namespace Database\Seeders;

use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Semester::create([
            'tahun_ajaran' => '2024/2025',
            'semester' => 'Ganjil',
            'tanggal_mulai' => '2024-08-01',
            'tanggal_selesai' => '2024-12-31',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        Semester::create([
            'tahun_ajaran' => '2024/2025',
            'semester' => 'Genap',
            'tanggal_mulai' => '2024-02-01',
            'tanggal_selesai' => '2024-07-31',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
