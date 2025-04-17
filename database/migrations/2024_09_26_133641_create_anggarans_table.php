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
        Schema::create('anggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('tridharma_id')->constrained();
            $table->string('perihal');
            $table->string('status_anggaran')->default('PENDING');
            $table->string('jumlah_anggaran');
            $table->string('jumlah_anggaran_disetujui')->nullable();
            $table->timestamp('tgl_pengajuan');
            $table->date('tgl_disetujui')->nullable();
            $table->date('tgl_pencairan')->nullable();
            $table->string('status_pencairan')->default('belum');
            $table->string('anggaran');
            $table->string('keterangan')->default('tidak ada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggarans');
    }
};
