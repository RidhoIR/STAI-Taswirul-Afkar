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
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_ajaran'); // Tahun ajaran (misalnya: 2024/2025)
            $table->string('semester'); // Semester (misalnya: Ganjil atau Genap)
            $table->date('tanggal_mulai'); // Tanggal mulai semester
            $table->date('tanggal_selesai'); // Tanggal selesai semester
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};
