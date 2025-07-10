<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Anggaran;
use App\Models\lpj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardDosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();
        $anggaranCount = Anggaran::where('user_id', $userId)->count();
        $anggarandisetujui = Anggaran::where('status_anggaran', 'disetujui')->where('user_id', $userId)->count();
        $lpjCount = Lpj::join('anggarans', 'lpjs.id_anggaran', '=', 'anggarans.id')
            ->where('anggarans.user_id', $userId)
            ->count();

        $lpjDiterima = Lpj::join('anggarans', 'lpjs.id_anggaran', '=', 'anggarans.id')
            ->where('lpjs.tgl_diterima', '!=', null)
            ->where('anggarans.user_id', $userId)
            ->count();

        return Inertia::render('Pengurus/dashboard-dosen', compact('anggaranCount', 'anggarandisetujui', 'lpjCount', 'lpjDiterima'));
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
