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

    public function tanggunganPembayaran()
    {
        return $this->hasMany(TanggunganPembayaran::class);
    }

    public function jenis_pembayaran_semester()
    {
        return $this->hasMany(JenisPembayaranSemester::class);
    }
}
