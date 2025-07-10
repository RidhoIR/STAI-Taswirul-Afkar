<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailLaporanPemasukan extends Model
{
    protected $fillable = [
        'laporan_id',
        'transaksi_id',
        'transaksi_harian_id',
    ];

    public function laporan()
    {
        return $this->belongsTo(Laporan::class);
    }

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class);
    }
}
