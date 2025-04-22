<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'semester_id',
        'name',
        'nim',
        'prodi',
        'tahun_masuk',
        'status',
        'email',
        'password'
    ];

    protected $hidden = ['password'];

    protected static function booted()
    {
        static::created(function ($mahasiswa) {
            $semesters = Semester::all();
            $jenisPembayarans = JenisPembayaran::all();
            $jenis_pembayaran_semester = DetailJenisPembayaran::all();

            foreach ($semesters as $semester) {
                foreach ($jenis_pembayaran_semester as $jenis) {
                    TanggunganPembayaran::create([
                        'mahasiswa_id' => $mahasiswa->id,
                        'semester_id' => $semester->id,
                        'detail_jenis_pembayaran_id' => $jenis->id,
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

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function tanggungan_pembayaran()
    {
        return $this->hasMany(TanggunganPembayaran::class);
    }
}
