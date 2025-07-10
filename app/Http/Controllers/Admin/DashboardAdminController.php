<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Anggaran;
use App\Models\lpj;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardAdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mahasiswaCount = Mahasiswa::count();
        $anggaranCount = Anggaran::count();
        $lpjCount = lpj::count();
        $anggaranDisetujui = Anggaran::where('status_anggaran', 'disetujui')->count();

        return Inertia::render('Admin/dashboard-admin', [
            'mahasiswaCount' => $mahasiswaCount,
            'anggaranCount' => $anggaranCount,
            'lpjCount' => $lpjCount,
            'anggaranDisetujui' => $anggaranDisetujui
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
