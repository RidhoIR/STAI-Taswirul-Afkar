<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TanggunganPembayaran extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function tanggunganMahasiswa($id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        $tanggungan_pembayaran = $mahasiswa->tanggungan_pembayaran()
            ->with(['jenis_pembayaran_semester.jenis_pembayaran', 'semester', 'mahasiswa']) // load relasi yang dibutuhkan
            ->orderBy('created_at', 'desc') // FIFO berdasarkan tanggal_pembayaran
            ->get();
        return Inertia::render('Admin/Bendahara/Mahasiswa/detail-mahasiswa/index', [
            'mahasiswa' => $mahasiswa,
            'tanggungan_pembayaran' => $tanggungan_pembayaran,
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
