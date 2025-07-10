<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Honorarium extends Model
{

    protected $table = 'honorariums';
    protected $guarded = ['id'];

    public function detail_laporan_pengeluarans()
    {
        return $this->hasMany(DetailLaporanPengeluaran::class);
    }

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class);
    }
}
