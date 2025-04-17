<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'), // Ganti dengan password yang aman
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'Ridho Ikhsandria',
            'email' => 'ridho@gmail.com',
            'password' => Hash::make('ridho123'), // Ganti dengan password yang aman
            'role' => 'pengurus',
        ]);
        User::create([
            'name' => 'Bendahara',
            'email' => 'bendahara@gmail.com',
            'password' => Hash::make('bendahara123'), // Ganti dengan password yang aman
            'role' => 'bendahara',
        ]);
    }
}
