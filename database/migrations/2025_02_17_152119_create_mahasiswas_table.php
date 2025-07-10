<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->string('foto')->nullable();
            $table->string('name');
            $table->string('nim')->unique(); // Nomor Induk Mahasiswa
            $table->string('prodi')->default('Pendidikan Agama Islam');
            $table->string('tahun_masuk');
            $table->enum('status', ['aktif', 'lulus', 'cuti', 'drop_out'])->default('aktif'); // Status mahasiswa
            $table->enum('jenis_mahasiswa', ['reguler', 'beasiswa'])->default('reguler');
            $table->string('no_telp')->nullable(); // ✅ ditambahkan di sini
            $table->string('email')->unique()->nullable();
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
