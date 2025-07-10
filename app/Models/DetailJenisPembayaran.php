<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailJenisPembayaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_pembayaran_id',
        'semester_id',
        'jumlah',
    ];

    protected static function booted()
    {
        static::created(function ($jenis) {
            $mahasiswas = Mahasiswa::where('jenis_mahasiswa', 'reguler')->get();


            foreach ($mahasiswas as $mahasiswa) {
                // Perhatikan: hanya untuk semester yang sesuai dengan instance yang baru dibuat
                TanggunganPembayaran::firstOrCreate(
                    [
                        'mahasiswa_id' => $mahasiswa->id,
                        'detail_jenis_pembayaran_id' => $jenis->id,
                    ],
                    [
                        // 'semester_id' => $jenis->semester_id,
                        'jumlah' => $jenis->jumlah,
                        'status' => 'belum_bayar',
                    ]
                );
            }
        });
    }

    public function jenis_pembayaran()
    {
        return $this->belongsTo(JenisPembayaran::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function tanggungan_pembayaran()
    {
        return $this->hasMany(TanggunganPembayaran::class);
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }
}
