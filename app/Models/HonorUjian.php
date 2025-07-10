<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorUjian extends Model
{
    protected $guarded = ['id'];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function detail_laporan_pengeluarans()
    {
        return $this->hasMany(DetailLaporanPengeluaran::class);
    }

    public function tugas(){
        return $this->hasMany(HonorUjianTugas::class, 'honor_ujian_id');
    }
}
