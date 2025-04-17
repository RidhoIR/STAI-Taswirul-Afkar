<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPembayaranSemester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisPembayaranSemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenis_pembayaran_semester = JenisPembayaranSemester::with([ 'jenis_pembayaran', 'semester'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Bendahara/detail-jenis-pembayaran/index', [
            'jenis_pembayaran_semester' => $jenis_pembayaran_semester
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
