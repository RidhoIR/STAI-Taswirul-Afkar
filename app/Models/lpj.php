<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class lpj extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_anggaran',
        'tgl_pengajuan',
        'tgl_diterima',
        'file_laporan',
        'foto_dokumentasi',
        'narasi',
    ];

    // Relationship with the Anggaran model
    public function anggaran()
    {
        return $this->belongsTo(Anggaran::class, 'id_anggaran');
    }
}
