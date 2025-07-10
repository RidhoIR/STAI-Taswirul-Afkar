<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HonorPPL;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HonorPplController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $honor_ppl = HonorPPL::with('semester', 'tugas')->get();

        return Inertia::render('Admin/Bendahara/honor-ppl/index', [
            'honor_ppl' => $honor_ppl,
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
            $validated = $request->validate([
                'semester_id' => 'required|exists:semesters,id',
                'nama' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'tugas' => 'required|array',
                'tugas.*.jenis_tugas' => 'required|string',
                'tugas.*.jumlah' => 'nullable|integer',
                'tugas.*.honor_per_tugas' => 'nullable|integer',
            ]);

            $honor = HonorPPL::create([
                'semester_id' => $validated['semester_id'],
                'nama' => $validated['nama'],
                'tanggal' => $validated['tanggal'],
            ]);

            foreach ($validated['tugas'] as $tugas) {
                // Hitung honor_total di server, bukan dari request
                $jumlah = $tugas['jumlah'] ?? 0;
                $honor_per_tugas = $tugas['honor_per_tugas'] ?? 0;

                $honor_total = in_array($tugas['jenis_tugas'], ['penguji', 'pembimbing'])
                    ? $jumlah * $honor_per_tugas
                    : ($tugas['honor_per_tugas'] ?? 0); // Untuk panitia/sekretaris: honor_per_tugas adalah honor tetap

                $honor->tugas()->create([
                    'jenis_tugas' => $tugas['jenis_tugas'],
                    'jumlah' => $jumlah ?: null,
                    'honor_per_tugas' => $honor_per_tugas ?: null,
                    'honor_total' => $honor_total,
                ]);
            }

            return redirect()->back()->with('success', 'Data berhasil disimpan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, HonorPPL $honorPpl)
    {
        try {
            $validated = $request->validate([
                'semester_id' => 'required|exists:semesters,id',
                'nama' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'tugas' => 'required|array',
                'tugas.*.id' => 'nullable|exists:honor_ujian_tugas,id',
                'tugas.*.jenis_tugas' => 'required|string',
                'tugas.*.jumlah' => 'nullable|integer',
                'tugas.*.honor_per_tugas' => 'nullable|integer',
            ]);

            // Update header honorPpl
            $honorPpl->update([
                'semester_id' => $validated['semester_id'],
                'nama' => $validated['nama'],
                'tanggal' => $validated['tanggal'],
            ]);

            $existingIds = [];

            foreach ($validated['tugas'] as $tugas) {
                $jumlah = in_array($tugas['jenis_tugas'], ['pembuat soal', 'korektor', 'pengawas'])
                    ? ($tugas['jumlah'] ?? 0)
                    : null;

                $honor_per_tugas = $tugas['honor_per_tugas'] ?? 0;
                $honor_total = $jumlah ? $jumlah * $honor_per_tugas : $honor_per_tugas;

                if (!empty($tugas['id'])) {
                    // Update tugas lama
                    $honorPpl->tugas()->where('id', $tugas['id'])->update([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                    ]);
                    $existingIds[] = $tugas['id'];
                } else {
                    // Create tugas baru
                    $new = $honorPpl->tugas()->create([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                    ]);
                    $existingIds[] = $new->id;
                }
            }

            // Hapus tugas yang tidak ada di inputan baru
            $honorPpl->tugas()->whereNotIn('id', $existingIds)->delete();

            return redirect()->back()->with('success', 'Data berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


    public function destroy($id)
    {
        try {
            $honor = HonorPPL::findOrFail($id);

            // Hapus relasi tugas terlebih dahulu
            $honor->tugas()->delete();

            // Hapus honor utama
            $honor->delete();

            return redirect()->back()->with('success', 'Data honor skripsi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus: ' . $e->getMessage());
        }
    }

    public function invoicePdf($id)
    {
        Carbon::setLocale('id');
        // Ambil honor skripsi beserta relasi semester dan tugas
        $honor = HonorPPL::with(['semester', 'tugas'])->findOrFail($id);

        // Load view dan generate PDF
        $pdf = Pdf::loadView('inv-honor-ppl', compact('honor'))
            ->setPaper('a5', 'portrait');

        // Stream file PDF ke browser
        return $pdf->stream('Invoice_Honor_PPL_' . str_replace(' ', '_', $honor->nama) . '.pdf');
    }

    public function laporanPdf(Request $request)
    {
        $request->validate([
            'semester' => 'required|exists:semesters,id',
        ]);

        $semesterId = $request->semester;

        $honorList = HonorPPL::with(['semester', 'tugas'])
            ->where('semester_id', $semesterId)
            ->get();

        if ($honorList->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada data honor untuk semester tersebut.');
        }

        $semester = $honorList->first()->semester;

        $pdf = Pdf::loadView('laporan-honor-ppl', [
            'honorList' => $honorList,
            'semester' => $semester,
        ]);

        return $pdf->stream('Laporan_Honor_PPL-KKN_Semester_' . $semester->nama . '.pdf');
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
}
