<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailJenisPembayaran;
use App\Models\JenisPembayaran;
use App\Models\Mahasiswa;
use App\Models\TanggunganPembayaran;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $mahasiswa_id)
    {
        try {
            $request->validate([
                'jenis_pembayaran_id' => 'required|exists:jenis_pembayarans,id',
                'semester_id' => 'nullable|exists:semesters,id',
                'jumlah' => 'required|numeric|min:1',
                'deskripsi' => 'nullable|string',
            ]);

            // Ambil mahasiswa
            $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);

            // Cari detail_jenis_pembayaran
            $detailPembayaran = DetailJenisPembayaran::where('jenis_pembayaran_id', $request->jenis_pembayaran_id)
                ->where('semester_id', $request->semester_id)
                ->firstOrFail();

            // Cari atau buat TanggunganPembayaran
            $tanggungan = TanggunganPembayaran::firstOrCreate(
                [
                    'mahasiswa_id' => $mahasiswa_id,
                    'detail_jenis_pembayaran_id' => $detailPembayaran->id,
                ],
                [
                    'jumlah' => $detailPembayaran->jumlah,
                    'status' => 'belum_bayar',
                ]
            );

            // Hitung sisa
            $sisa = $tanggungan->sisa_pembayaran();

            // Validasi apakah jumlah melebihi sisa
            if ($request->jumlah > $sisa) {
                return redirect()->back()->with('error', 'Jumlah melebihi sisa tagihan. Sisa: Rp. ' . number_format($sisa, 0, ',', '.'));
            }

            // Buat transaksi
            Transaksi::create([
                'user_id' => Auth::id(),
                'no_invoice' => 'INV-' . Str::upper(Str::random(10)),
                'mahasiswa_id' => $mahasiswa_id,
                'detail_jenis_pembayaran_id' => $detailPembayaran->id,
                'tanggungan_pembayaran_id' => $tanggungan->id,
                'jumlah' => $request->jumlah,
                'tanggal_pembayaran' => now(),
                'deskripsi' => $request->deskripsi ?? "Pembayaran oleh {$mahasiswa->nama}",
            ]);

            // Perbarui status jika lunas
            if ($tanggungan->sisa_pembayaran() <= 0) {
                $tanggungan->update(['status' => 'lunas']);
            } elseif ($tanggungan->sisa_pembayaran() > 0 && $tanggungan->total_dibayar() > 0) {
                $tanggungan->update(['status' => 'belum_lunas']);
            } else {
                $tanggungan->update(['status' => 'belum_bayar']);
            }

            return redirect()->back()->with('success', 'Transaksi berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
