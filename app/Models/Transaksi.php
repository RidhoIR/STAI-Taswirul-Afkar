<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaksi extends Model
{

    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'no_invoice' => 'string',
    ];

    protected $fillable = [
        'mahasiswa_id',
        'no_invoice',
        'user_id',
        'jenis_pembayaran_id',
        'semester_id',
        'deskripsi',
        'jumlah',
        'tanggal_pembayaran'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function jenis_pembayaran()
    {
        return $this->belongsTo(JenisPembayaran::class, 'jenis_pembayaran_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
