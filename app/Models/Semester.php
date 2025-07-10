<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $fillable = [
        'tahun_ajaran',
        'semester',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    public function mahasiswa()
    {
        return $this->hasMany(Mahasiswa::class);
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function honor_ujian()
    {
        return $this->hasMany(HonorUjian::class);
    }

    public function honor_skripsi()
    {
        return $this->hasMany(HonorSkripsi::class);
    }

    public function honor_proposal()
    {
        return $this->hasMany(HonorProposal::class);
    }

    public function honor_ppl()
    {
        return $this->hasMany(HonorPPL::class);
    }

    public function honor_wisuda()
    {
        return $this->hasMany(HonorWisuda::class);
    }

    public function detail_jenis_pembayaran()
    {
        return $this->hasMany(DetailJenisPembayaran::class);
    }
}
