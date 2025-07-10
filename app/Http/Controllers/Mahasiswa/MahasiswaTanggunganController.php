<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MahasiswaTanggunganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        $tanggungan_pembayaran = $mahasiswa->tanggungan_pembayaran()
            ->with('detail_jenis_pembayaran.jenis_pembayaran', 'detail_jenis_pembayaran.semester')
            ->get()
            ->map(function ($tanggungan) {
                return [
                    'id' => $tanggungan->id,
                    'jumlah' => $tanggungan->jumlah,
                    'status' => $tanggungan->status,
                    'mahasiswa' => $tanggungan->mahasiswa,
                    'detail_jenis_pembayaran' => $tanggungan->detail_jenis_pembayaran,
                    'transaksis' => $tanggungan->transaksis,
                    'total_dibayar' => $tanggungan->total_dibayar(),
                    'sisa_pembayaran' => $tanggungan->sisa_pembayaran(),
                ];
            })
            ->sortByDesc(function ($item) {
                return $item->detail_jenis_pembayaran->semester->created_at ?? now()->subYears(100); // fallback jika null
            })
            ->values();

        return Inertia::render('Mahasiswa/tanggungan-pembayaran/index', [
            'tanggungan_pembayaran' => $tanggungan_pembayaran,
            'mahasiswa' => $mahasiswa
        ]);
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
    public function store(Request $request)
    {
        //
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
