<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailLaporan extends Model
{
    protected $fillable = [
        'laporan_id',
        'jenis',
        'sumber',
        'jumlah',
    ];

    public function laporan()
    {
        return $this->belongsTo(Laporan::class);
    }
}
