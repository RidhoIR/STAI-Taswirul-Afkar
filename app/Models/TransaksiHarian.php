<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiHarian extends Model
{
    protected $fillable = [
        'user_id',
        'deskripsi',
        'tanggal',
        'jenis',
        'jumlah',
    ];

    /**
     * Relasi ke model User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detail_laporan_pengeluarans()
    {
        return $this->hasMany(DetailLaporanPengeluaran::class);
    }

    public function detail_laporan_pemasukans()
    {
        return $this->hasMany(DetailLaporanPemasukan::class);
    }
}
