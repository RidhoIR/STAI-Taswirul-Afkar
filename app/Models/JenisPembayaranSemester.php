<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisPembayaranSemester extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_pembayaran_id',
        'semester_id',
        'jumlah',
    ];

    public function jenis_pembayaran()
    {
        return $this->belongsTo(JenisPembayaran::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
