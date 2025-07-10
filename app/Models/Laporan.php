<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    protected $fillable = [
        'periode_awal',
        'periode_akhir',
        'total_pemasukan',
        'total_pengeluaran',
        'saldo_awal',
        'saldo_akhir',
    ];

    public function detail_laporan_pemasukans()
    {
        return $this->hasMany(DetailLaporanPemasukan::class);
    }

    public function detail_laporan_pengeluarans()
    {
        return $this->hasMany(DetailLaporanPengeluaran::class);
    }

    public function detail_laporans()
    {
        return $this->hasMany(DetailLaporan::class);
    }
}
