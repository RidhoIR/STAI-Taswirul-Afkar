<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use App\Models\TanggunganPembayaran;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardMahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Carbon::setLocale('id');
        $mahasiswa = Auth::guard('mahasiswa')->user();
        $transaksi = $mahasiswa->transaksi()
            ->with('detail_jenis_pembayaran.jenis_pembayaran', 'detail_jenis_pembayaran.semester') // tambahkan eager loading relasi
            ->latest()
            ->get();


        $totalTransaksi = $mahasiswa->transaksi()->sum('jumlah');
        $allTanggungan = $mahasiswa->tanggungan_pembayaran()
            ->sum('jumlah');

        $totalTunggakan = $allTanggungan - $totalTransaksi;

        $semesterAktif = Semester::latest()->first(); // sesuaikan kalau pakai flag is_aktif
        // dd($semesterAktif);

        $tanggunganSPP = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran', function ($query) use ($semesterAktif) {
                $query->where('semester_id', $semesterAktif->id)
                    ->whereHas('jenis_pembayaran', function ($subQuery) {
                        $subQuery->where('nama_pembayaran', 'SPP');
                    });
            })->first()?->status;

        $statusSPP = $tanggunganSPP === 'lunas' ? 'Lunas' : 'Belum Lunas';

        // dd($tanggunganSPP);



        return Inertia::render('Mahasiswa/dashboard-mahasiswa', [
            'mahasiswa' => $mahasiswa,
            'transaksi' => $transaksi,
            'totalTunggakan' => $totalTunggakan,
            'status_spp' => $statusSPP,
            'semester_aktif' => $semesterAktif,
            'totalTransaksi' => $totalTransaksi,
            'allTanggungan' => $allTanggungan
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
