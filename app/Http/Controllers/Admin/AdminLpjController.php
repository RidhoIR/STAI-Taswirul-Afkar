<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\lpj;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLpjController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lpjs = lpj::with('anggaran.user')->get();
        return Inertia::render('Admin/Pengurus/Laporan/index', [
            'lpjs' => $lpjs,
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
        try {
            $lpj = Lpj::findOrFail($id);

            // Update the tgl_diterima field to the current timestamp
            $lpj->tgl_diterima = now();
            $lpj->save();

            return redirect()->back()->with('success', 'Tanggal diterima berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui tanggal diterima: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
