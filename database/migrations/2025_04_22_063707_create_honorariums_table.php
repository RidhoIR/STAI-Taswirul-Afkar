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
        Schema::create('honorariums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jabatan_id')->nullable();
            $table->string('name');
            $table->integer('jumlah_mk')->nullable();
            $table->bigInteger('honor_mk');
            $table->date('periode');
            $table->integer('lain_lain')->nullable();
            $table->bigInteger('jumlah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('honorariums');
    }
};
