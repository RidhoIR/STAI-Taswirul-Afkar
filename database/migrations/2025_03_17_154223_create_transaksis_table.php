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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('no_invoice')->unique(); // Gunakan UUID untuk no_invoice
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade'); // Relasi ke mahasiswa
            $table->foreignId('detail_jenis_pembayaran_id')->constrained('detail_jenis_pembayarans')->onDelete('cascade'); // Relasi ke jenis pembayaran
            $table->foreignId('tanggungan_pembayaran_id')->references('id')->on('tanggungan_pembayarans')->onDelete('cascade');
            // $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade'); // Relasi ke semester
            $table->string('deskripsi')->nullable();
            $table->decimal('jumlah', 10, 2); // Jumlah yang dibayar
            $table->date('tanggal_pembayaran'); // Tanggal pembayaran
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
