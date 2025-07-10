<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anggaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'id_tridharma',
        'perihal',
        'status_anggaran',
        'jumlah_anggaran',
        'jumlah_anggaran_disetujui',
        'tgl_pengajuan',
        'tgl_disetujui',
        'tgl_pencairan',
        'status_pencairan',
        'anggaran',
        'keterangan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tridharma(){
        return $this->belongsTo(Tridharma::class);
    }

    public function lpjs(){
        return $this->hasMany(Lpj::class);
    }

    public function detail_laporan_pengeluarans(){
        return $this->hasMany(DetailLaporanPengeluaran::class);
    }
}
