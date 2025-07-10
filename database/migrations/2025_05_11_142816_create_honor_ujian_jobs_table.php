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
        Schema::create('honor_ujian_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('honor_ujian_id')->constrained()->onDelete('cascade');
            $table->enum('jenis_tugas', ['pembuat soal', 'korektor', 'pengawas', 'panitia']);
            $table->integer('jumlah')->nullable(); // jumlah diuji/dibimbing, null untuk panitia/sekretaris
            $table->integer('honor_per_tugas')->nullable(); // harga per tugas
            $table->integer('honor_total'); // jumlah * honor_per_tugas, atau input manual
            $table->enum('tipe_ujian', ['UTS', 'UAS']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('honor_ujian_tugas');
    }
};
