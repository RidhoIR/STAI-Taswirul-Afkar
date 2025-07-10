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
        Schema::create('honor_wisudas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tugas');
            $table->integer('honor_per_tugas');
            $table->integer('honor_total'); 
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('honor_wisudas');
    }
};
