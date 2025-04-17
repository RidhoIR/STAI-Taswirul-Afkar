<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPembayaran extends Model
{
    protected $fillable = [
        'nama_pembayaran',
        'jumlah',
    ];

    protected static function booted()
{
    static::created(function ($jenis) {
        $mahasiswas = Mahasiswa::all();
        $semesters = Semester::all();

        foreach ($semesters as $semester) {
            foreach ($mahasiswas as $mahasiswa) {
                TanggunganPembayaran::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'semester_id' => $semester->id,
                    'jenis_pembayaran_id' => $jenis->id,
                    'jumlah' => $jenis->jumlah,
                    'status' => 'belum_bayar',
                ]);
            }
        }
    });
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
