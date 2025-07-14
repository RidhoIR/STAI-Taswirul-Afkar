<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = ['id'];

    protected $hidden = ['password'];

    protected static function booted()
    {
        static::created(function ($mahasiswa) {
            // ✅ Lewati mahasiswa beasiswa penuh
            if ($mahasiswa->jenis_mahasiswa === 'beasiswa') {
                return;
            }

            // ✅ Ambil semester yang aktif berdasarkan tanggal hari ini
            $today = Carbon::today();
            $semesterSekarang = Semester::where('tanggal_mulai', '<=', $today)
                ->where('tanggal_selesai', '>=', $today)
                ->first();

            if ($semesterSekarang) {
                // ✅ Ambil semua detail jenis pembayaran untuk semester aktif
                $jenisPembayaranSemester = DetailJenisPembayaran::where('semester_id', $semesterSekarang->id)->get();

                foreach ($jenisPembayaranSemester as $jenis) {
                    TanggunganPembayaran::create([
                        'mahasiswa_id' => $mahasiswa->id,
                        'semester_id' => $semesterSekarang->id,
                        'detail_jenis_pembayaran_id' => $jenis->id,
                        'jumlah' => $jenis->jumlah,
                        'status' => 'belum_bayar',
                    ]);
                }
            }

            // ✅ Tambahkan pembayaran yang tidak terkait semester (misalnya Proposal dan Skripsi)
            $pembayaranNonSemester = JenisPembayaran::where('is_once', true)->get();

            foreach ($pembayaranNonSemester as $jenis) {
                $detail = DetailJenisPembayaran::where('jenis_pembayaran_id', $jenis->id)
                    ->orderByDesc('id') // Ambil jumlah terakhir yang pernah di-set
                    ->first();

                if ($detail) {
                    TanggunganPembayaran::create([
                        'mahasiswa_id' => $mahasiswa->id,
                        'semester_id' => null,
                        'detail_jenis_pembayaran_id' => $detail->id,
                        'jumlah' => $detail->jumlah,
                        'status' => 'belum_bayar',
                    ]);
                }
            }
        });
    }



    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function tanggungan_pembayaran()
    {
        return $this->hasMany(TanggunganPembayaran::class);
    }
}
