<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HonorWisuda;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HonorWisudaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $honor_wisuda = HonorWisuda::all();

        return Inertia::render('Admin/Bendahara/honor-wisuda/index', [
            'honor_wisuda' => $honor_wisuda,
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
        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'tugas' => 'required|string|min:1',
                'honor_per_tugas' => 'required|numeric'
            ]);

            $honot_total = $request->honor_per_tugas;

            HonorWisuda::create([
                'nama' => $request->nama,
                'tanggal' => now(),
                'tugas' => $request->tugas,
                'honor_per_tugas' => $request->honor_per_tugas,
                'honor_total' => $honot_total
            ]);

            return redirect()->back()->with('success', 'Honor Wisuda berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'tugas' => 'required|string|min:1',
                'honor_per_tugas' => 'required|numeric'
            ]);

            $honot_total = $request->honor_per_tugas;

            $honor = HonorWisuda::findOrFail($id);

            $honor->update([
                'nama' => $request->nama,
                'tugas' => $request->tugas,
                'honor_per_tugas' => $request->honor_per_tugas,
                'honor_total' => $honot_total
            ]);

            return redirect()->back()->with('success', 'Data honor Wisuda berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


    public function destroy($id)
    {
        try {
            $honor = HonorWisuda::findOrFail($id);
            $honor->delete();

            return redirect()->back()->with('success', 'Data honor berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function invoicePdf($id)
    {
        Carbon::setLocale('id');
        $honor = HonorWisuda::findOrFail($id);
        $pdf = Pdf::loadView('inv-honor-wisuda', compact('honor'))->setPaper('a5', 'portrait');
        return $pdf->stream('Invoice_Honorarium_wisuda_' . $honor->nama . '.pdf');
    }

    public function laporanPdf(Request $request)
    {
        Carbon::setLocale('id');

        $request->validate([
            'tahun' => 'required|digits:4',
        ]);

        $tahun = $request->tahun;

        $honorList = HonorWisuda::whereYear('tanggal', $tahun)
            ->get();

        if ($honorList->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada data honor untuk tahun tersebut.');
        }


        $pdf = Pdf::loadView('laporan-honor-wisuda', [
            'honorList' => $honorList,
            'tahun' => $tahun,

        ]);

        return $pdf->stream('Laporan_Honor_Wisuda_Tahun_' . $tahun . '.pdf');
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
}
