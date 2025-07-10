<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPembayaran extends Model
{
    protected $fillable = [
        'nama_pembayaran',
        'is_once',
    ];
    protected $casts = [
        'is_once' => 'boolean',
    ];

    //     protected static function booted()
    // {
    //     static::created(function ($jenis) {
    //         $mahasiswas = Mahasiswa::all();
    //         $semesters = Semester::all();

    //         foreach ($semesters as $semester) {
    //             foreach ($mahasiswas as $mahasiswa) {
    //                 TanggunganPembayaran::create([
    //                     'mahasiswa_id' => $mahasiswa->id,
    //                     'semester_id' => $semester->id,
    //                     'detail_jenis_pembayaran_id' => $jenis->id,
    //                     'jumlah' => $jenis->jumlah,
    //                     'status' => 'belum_bayar',
    //                 ]);
    //             }
    //         }
    //     });
    // }

    // public function transaksi()
    // {
    //     return $this->hasMany(Transaksi::class);
    // }

    // public function tanggungan_pembayaran()
    // {
    //     return $this->hasMany(TanggunganPembayaran::class);
    // }

    public function detail_jenis_pembayaran()
    {
        return $this->hasMany(DetailJenisPembayaran::class);
    }
}
