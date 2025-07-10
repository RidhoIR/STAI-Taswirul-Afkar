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
        return $this->belongsTo(DetailJenisPembayaran::class,);
    }

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function total_dibayar()
    {
        return $this->transaksis()->sum('jumlah');
    }

    public function sisa_pembayaran()
    {
        return $this->jumlah - $this->total_dibayar();
    }
}
