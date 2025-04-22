<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TanggunganPembayaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id',
        'detail_jenis_pembayaran_id',
        // 'semester_id',
        'jumlah',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function detail_jenis_pembayaran()
    {
        return $this->belongsTo(DetailJenisPembayaran::class, );
    }

    // public function semester()
    // {
    //     return $this->belongsTo(Semester::class);
    // }
}
