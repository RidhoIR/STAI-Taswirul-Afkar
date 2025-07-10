<?php

namespace Database\Seeders;

use App\Models\DetailJenisPembayaran;
use App\Models\TransaksiHarian;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UserSeeder::class,
            TridharmaSeeder::class,
            SemesterSeeder::class,
            MahasiswaSeeder::class,
            JenisPembayaranSeeder::class,
            DetailJenisPembayaranSeeder::class,
            TanggunganPembayaranSeeder::class,
            JabatanSeeder::class,
            // TransaksiSeeder::class
            // HonorariumSeeder::class,
            // HonorSkripsiSeeder::class,
            TransaksiHarianSeeder::class,
            // HonorUjianSeeder::class,
        ]);
    }
}
