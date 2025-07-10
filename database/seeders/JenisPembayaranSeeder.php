<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_pembayaran' => 'her', 'is_once' => false],
            ['nama_pembayaran' => 'sema', 'is_once' => false],
            ['nama_pembayaran' => 'spp', 'is_once' => false],
            ['nama_pembayaran' => 'uts', 'is_once' => false],
            ['nama_pembayaran' => 'uas', 'is_once' => false],
            ['nama_pembayaran' => 'ukm', 'is_once' => false],
            ['nama_pembayaran' => 'lain-lain', 'is_once' => false],
            ['nama_pembayaran' => 'ordik', 'is_once' => false],
            ['nama_pembayaran' => 'pendaftaran', 'is_once' => true],
            ['nama_pembayaran' => 'Proposal', 'is_once' => true],
            ['nama_pembayaran' => 'Skripsi', 'is_once' => true],
        ];

        foreach ($data as $item) {
            DB::table('jenis_pembayarans')->insert([
                'nama_pembayaran' => $item['nama_pembayaran'],
                'is_once' => $item['is_once'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
