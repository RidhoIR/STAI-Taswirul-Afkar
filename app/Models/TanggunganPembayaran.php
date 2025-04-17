<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TanggunganPembayaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id',
        'jenis_pembayaran_id',
        'semester_id',
        'jumlah',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function jenis_pembayaran()
    {
        return $this->belongsTo(JenisPembayaran::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
