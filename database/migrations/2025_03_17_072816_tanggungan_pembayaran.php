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
        Schema::create('tanggungan_pembayarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');
            $table->foreignId('detail_jenis_pembayaran_id')->constrained('detail_jenis_pembayarans')->onDelete('cascade');
            // $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->integer('jumlah'); // bisa override jumlah default
            $table->string('status')->default('belum_bayar');
            $table->timestamps();

            // $table->unique(['mahasiswa_id', 'detail_jenis_pembayaran_id'], 'unik_tanggungan'); // satu tanggungan per jenis per semester
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tanggungan_pembayarans');
    }
};
