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
        Schema::create('honor_skripsi_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('honor_skripsi_id')->constrained()->onDelete('cascade');
            $table->enum('jenis_tugas', ['penguji', 'pembimbing', 'panitia', 'sekretaris']);
            $table->integer('jumlah')->nullable(); // jumlah diuji/dibimbing, null untuk panitia/sekretaris
            $table->integer('honor_per_tugas')->nullable(); // harga per tugas
            $table->integer('honor_total'); // jumlah * honor_per_tugas, atau input manual
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('honor_skripsi_tugas');
    }
};
