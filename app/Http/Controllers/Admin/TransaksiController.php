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
                'jenis_pembayaran_id' => 'required',
                'semester_id' => 'required',
                'jumlah' => 'required|numeric',
                'deskripsi' => 'nullable|string',
            ]);

            // Temukan detail jenis pembayaran berdasarkan jenis_pembayaran_id dan semester_id
            $detailPembayaran = DetailJenisPembayaran::where('jenis_pembayaran_id', $request->jenis_pembayaran_id)
                ->where('semester_id', $request->semester_id)
                ->firstOrFail();

            // Ambil data mahasiswa
            $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);

            // Buat no invoice
            $noInvoice = 'INV-' . Str::upper(Str::random(10));

            // Deskripsi default
            $deskripsi = $request->deskripsi ?? "Pembayaran  oleh {$mahasiswa->nama}";

            // Simpan transaksi
            $transaksi = Transaksi::create([
                'user_id' => Auth::id(),
                'no_invoice' => $noInvoice,
                'mahasiswa_id' => $mahasiswa_id,
                'detail_jenis_pembayaran_id' => $detailPembayaran->id,
                'jumlah' => $request->jumlah,
                'tanggal_pembayaran' => now(),
                'deskripsi' => $deskripsi,
            ]);

            // Update status tanggungan menjadi lunas
            TanggunganPembayaran::where('mahasiswa_id', $mahasiswa_id)
                ->where('detail_jenis_pembayaran_id', $detailPembayaran->id)
                ->update(['status' => 'lunas']);
            // dd($detailPembayaran);

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
