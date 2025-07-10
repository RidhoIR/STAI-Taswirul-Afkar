<?php

namespace Database\Seeders;

use App\Models\TransaksiHarian;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransaksiHarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first(); // ambil user pertama sebagai pemilik transaksi

        if ($user) {
            TransaksiHarian::create([
                'user_id' => $user->id,
                'deskripsi' => 'Beli alat tulis kantor',
                'tanggal' => Carbon::now()->subDays(2),
                'jenis' => 'pengeluaran',
                'jumlah' => 50000,
            ]);

            TransaksiHarian::create([
                'user_id' => $user->id,
                'deskripsi' => 'Terima donasi',
                'tanggal' => Carbon::now()->subDay(),
                'jenis' => 'pemasukan',
                'jumlah' => 100000,
            ]);

            TransaksiHarian::create([
                'user_id' => $user->id,
                'deskripsi' => 'Beli air mineral',
                'tanggal' => Carbon::now(),
                'jenis' => 'pengeluaran',
                'jumlah' => 20000,
            ]);
        }
    }
}
