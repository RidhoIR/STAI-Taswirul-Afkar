<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HonorProposal;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HonorProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $honor_proposal = HonorProposal::with(['semester', 'tugas'])->get();

        return Inertia::render('Admin/Bendahara/honor-proposal/index', [
            'honor_proposal' => $honor_proposal,
        ]);
    }

    /**
     * Show the form for creating a new resource.
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

            $honor = HonorProposal::create([
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



    public function update(Request $request, HonorProposal $honorProposal)
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

            // Update data honor skripsi utama
            $honorProposal->update([
                'semester_id' => $validated['semester_id'],
                'nama' => $validated['nama'],
                'tanggal' => $validated['tanggal'],
            ]);

            // Hapus semua tugas lama
            $honorProposal->tugas()->delete();

            // Tambahkan tugas baru
            foreach ($validated['tugas'] as $tugas) {
                $jumlah = in_array($tugas['jenis_tugas'], ['penguji', 'pembimbing'])
                    ? ($tugas['jumlah'] ?? 0)
                    : null;

                $honor_per_tugas = $tugas['honor_per_tugas'] ?? 0;
                $honor_total = $jumlah ? $jumlah * $honor_per_tugas : $honor_per_tugas;

                $honorProposal->tugas()->create([
                    'jenis_tugas' => $tugas['jenis_tugas'],
                    'jumlah' => $jumlah,
                    'honor_per_tugas' => $honor_per_tugas,
                    'honor_total' => $honor_total,
                ]);
            }


            return redirect()->back()->with('success', 'Data berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }



    public function destroy($id)
    {
        try {
            $honor = HonorProposal::findOrFail($id);

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
        $honor = HonorProposal::with(['semester', 'tugas'])->findOrFail($id);

        // Load view dan generate PDF
        $pdf = Pdf::loadView('inv-honor-proposal', compact('honor'))
            ->setPaper('a5', 'portrait');

        // Stream file PDF ke browser
        return $pdf->stream('Invoice_Honor_Proposal_' . str_replace(' ', '_', $honor->nama) . '.pdf');
    }

    public function laporanPdf(Request $request)
    {
        $request->validate([
            'semester' => 'required|exists:semesters,id',
        ]);

        $semesterId = $request->semester;

        $honorList = HonorProposal::with(['semester', 'tugas'])
            ->where('semester_id', $semesterId)
            ->get();

        if ($honorList->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada data honor untuk semester tersebut.');
        }

        $semester = $honorList->first()->semester;

        $pdf = Pdf::loadView('laporan-honor-proposal', [
            'honorList' => $honorList,
            'semester' => $semester,
        ]);

        return $pdf->stream('Laporan_Honor_Proposal_Semester_' . $semester->nama . '.pdf');
    }
}
