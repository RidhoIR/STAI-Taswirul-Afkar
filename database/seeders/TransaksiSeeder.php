<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('transaksis')->insert([
            [
                'no_invoice' => 'INV-' . Str::upper(Str::random(10)), // UUID untuk no_invoice
                'user_id' => 1, // Sesuaikan dengan ID user yang ada di database
                'mahasiswa_id' => 1, // Sesuaikan dengan ID mahasiswa yang ada di database
                'jenis_pembayaran_id' => 1, // Sesuaikan dengan ID jenis pembayaran yang ada di database
                'semester_id' => 1, // Sesuaikan dengan ID semester yang ada di database
                'jumlah' => 500000.00,
                'tanggal_pembayaran' => Carbon::now()->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
