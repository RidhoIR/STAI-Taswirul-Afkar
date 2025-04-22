<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetailJenisPembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Semester 1
            ['jenis_pembayaran_id' => 1, 'semester_id' => 1, 'jumlah' => 1500000],
            ['jenis_pembayaran_id' => 2, 'semester_id' => 1, 'jumlah' => 250000],
            ['jenis_pembayaran_id' => 3, 'semester_id' => 1, 'jumlah' => 250000],

            // Semester 2
            ['jenis_pembayaran_id' => 1, 'semester_id' => 2, 'jumlah' => 1550000],
            ['jenis_pembayaran_id' => 2, 'semester_id' => 2, 'jumlah' => 260000],
            ['jenis_pembayaran_id' => 3, 'semester_id' => 2, 'jumlah' => 260000],
        ];

        DB::table('detail_jenis_pembayarans')->insert($data);
    
    }
}
