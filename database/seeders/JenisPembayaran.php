<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPembayaran extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_pembayaran' => 'her', 'jumlah' => 500000.00],
            ['nama_pembayaran' => 'sema', 'jumlah' => 200000.00],
            ['nama_pembayaran' => 'spp', 'jumlah' => 1000000.00],
            ['nama_pembayaran' => 'uts', 'jumlah' => 250000.00],
            ['nama_pembayaran' => 'uas', 'jumlah' => 250000.00],
            ['nama_pembayaran' => 'ukm', 'jumlah' => 100000.00],
            ['nama_pembayaran' => 'lain-lain', 'jumlah' => 150000.00],
            ['nama_pembayaran' => 'ordik', 'jumlah' => 300000.00],
            ['nama_pembayaran' => 'pendaftaran', 'jumlah' => 500000.00],
        ];

        foreach ($data as $item) {
            DB::table('jenis_pembayarans')->insert([
                'nama_pembayaran' => $item['nama_pembayaran'],
                'jumlah' => $item['jumlah'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
