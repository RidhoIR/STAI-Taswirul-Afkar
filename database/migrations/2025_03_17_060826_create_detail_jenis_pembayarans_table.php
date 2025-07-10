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
        Schema::create('detail_jenis_pembayarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_pembayaran_id')->constrained()->onDelete('cascade');
            $table->foreignId('semester_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('jumlah'); // jumlah default
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_jenis_pembayarans');
    }
};
