<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailLaporanPengeluaran extends Model
{
    protected $fillable = [
        'laporan_id',
        'anggaran_id',
        'honorarium_id',
        'honor_skripsi_id',
        'honor_ujian_id',
        'transaksi_harian_id',
    ];

    public function laporan()
    {
        return $this->belongsTo(Laporan::class);
    }

    public function anggaran()
    {
        return $this->belongsTo(Anggaran::class);
    }

    public function honorarium()
    {
        return $this->belongsTo(Honorarium::class);
    }

    public function honor_skripsi()
    {
        return $this->belongsTo(HonorSkripsi::class);
    }

    public function honor_ujian()
    {
        return $this->belongsTo(HonorUjian::class);
    }

    public function transaksi_harian()
    {
        return $this->belongsTo(TransaksiHarian::class);
    }
}
