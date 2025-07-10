<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HonorUjian;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HonorUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function indexUts()
    {
        $honor_uts = HonorUjian::with('semester', 'tugas')
            ->whereHas('tugas', function ($query) {
                $query->where('tipe_ujian', 'UTS');
            })
            ->get();
        return Inertia::render('Admin/Bendahara/honor-ujian/uts/index', ['honor_uts' => $honor_uts]);
    }

    public function indexUas()
    {
        $honor_uas = HonorUjian::with('semester', 'tugas')
            ->whereHas('tugas', function ($query) {
                $query->where('tipe_ujian', 'UAS');
            })
            ->get();
        return Inertia::render('Admin/Bendahara/honor-ujian/uas/index', ['honor_uas' => $honor_uas]);
    }

    // public function storeUts(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'nama' => 'required|string|max:255',
    //             'tugas' => 'required|array|min:1',
    //             'tugas.*' => 'string',
    //             'jumlah' => 'required|numeric|min:0',
    //             'semester_id' => 'required|exists:semesters,id',
    //             // 'tipe_ujian' => 'required|in:UTS,UAS',
    //         ]);

    //         HonorUjian::create([
    //             'nama' => $validated['nama'],
    //             'tugas' => $validated['tugas'],
    //             'jumlah' => $validated['jumlah'],
    //             'tanggal' => now(),
    //             'semester_id' => $validated['semester_id'],
    //             'tipe_ujian' => 'UTS',
    //         ]);

    //         return redirect()->back()->with('success', 'Honor Ujian berhasil ditambahkan.');
    //     } catch (\Exception $e) {
    //         return redirect()->back()->with('error', ': ' . $e->getMessage());
    //     }
    // }

    // public function storeUas(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'nama' => 'required|string|max:255',
    //             'tugas' => 'required|array|min:1',
    //             'tugas.*' => 'string',
    //             'jumlah' => 'required|numeric|min:0',
    //             'semester_id' => 'required|exists:semesters,id',
    //             // 'tipe_ujian' => 'required|in:UTS,UAS',
    //         ]);

    //         HonorUjian::create([
    //             'nama' => $validated['nama'],
    //             'tugas' => $validated['tugas'],
    //             'jumlah' => $validated['jumlah'],
    //             'tanggal' => now(),
    //             'semester_id' => $validated['semester_id'],
    //             'tipe_ujian' => 'UAS',
    //         ]);

    //         return redirect()->back()->with('success', 'Honor Ujian berhasil ditambahkan.');
    //     } catch (\Exception $e) {
    //         return redirect()->back()->with('error', ': ' . $e->getMessage());
    //     }
    // }

    public function storeUts(Request $request)
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

            $honor = HonorUjian::create([
                'semester_id' => $validated['semester_id'],
                'nama' => $validated['nama'],
                'tanggal' => $validated['tanggal'],
            ]);

            foreach ($validated['tugas'] as $tugas) {
                // Hitung honor_total di server, bukan dari request
                $jumlah = $tugas['jumlah'] ?? 0;
                $honor_per_tugas = $tugas['honor_per_tugas'] ?? 0;

                $honor_total = in_array($tugas['jenis_tugas'], ['pembuat soal', 'korektor', 'pengawas'])
                    ? $jumlah * $honor_per_tugas
                    : ($tugas['honor_per_tugas'] ?? 0); // Untuk panitia/sekretaris: honor_per_tugas adalah honor tetap

                $honor->tugas()->create([
                    'jenis_tugas' => $tugas['jenis_tugas'],
                    'jumlah' => $jumlah ?: null,
                    'honor_per_tugas' => $honor_per_tugas ?: null,
                    'honor_total' => $honor_total,
                    'tipe_ujian' => 'UTS',
                ]);
            }

            return redirect()->back()->with('success', 'Data berhasil disimpan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


    public function storeUas(Request $request)
    {
        try {
            $validated = $request->validate([
                'semester_id' => 'required|exists:semesters,id',
                'nama' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'tugas' => 'required|array',
                'tugas.*.jenis_tugas' => 'required|string',
                'tugas.*.jumlah' => 'nullable|integer',
                'tugas.*.honor_per_tugas' => 'nullable|integer', // ✅ tambahkan validasi ini

            ]);

            $honor = HonorUjian::create([
                'semester_id' => $validated['semester_id'],
                'nama' => $validated['nama'],
                'tanggal' => $validated['tanggal'],
            ]);

            foreach ($validated['tugas'] as $tugas) {
                // Hitung honor_total di server, bukan dari request
                $jumlah = $tugas['jumlah'] ?? 0;
                $honor_per_tugas = $tugas['honor_per_tugas'] ?? 0;

                $honor_total = in_array($tugas['jenis_tugas'], ['pembuat soal', 'korektor', 'pengawas'])
                    ? $jumlah * $honor_per_tugas
                    : ($tugas['honor_per_tugas'] ?? 0); // Untuk panitia/sekretaris: honor_per_tugas adalah honor tetap

                $honor->tugas()->create([
                    'jenis_tugas' => $tugas['jenis_tugas'],
                    'jumlah' => $jumlah ?: null,
                    'honor_per_tugas' => $honor_per_tugas ?: null,
                    'honor_total' => $honor_total,
                    'tipe_ujian' => 'UAS',
                ]);
            }

            return redirect()->back()->with('success', 'Data berhasil disimpan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function updateUas(Request $request, HonorUjian $honorUjian)
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

            // Update header HonorUjian
            $honorUjian->update([
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
                    $honorUjian->tugas()->where('id', $tugas['id'])->update([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                    ]);
                    $existingIds[] = $tugas['id'];
                } else {
                    // Create tugas baru
                    $new = $honorUjian->tugas()->create([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                        'tipe_ujian' => $honorUjian->tugas()->first()?->tipe_ujian ?? 'UAS', // fallback jika tidak ada
                    ]);
                    $existingIds[] = $new->id;
                }
            }

            // Hapus tugas yang tidak ada di inputan baru
            $honorUjian->tugas()->whereNotIn('id', $existingIds)->delete();

            return redirect()->back()->with('success', 'Data berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function updateUts(Request $request, HonorUjian $honorUjian)
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

            // Update header HonorUjian
            $honorUjian->update([
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
                    $honorUjian->tugas()->where('id', $tugas['id'])->update([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                    ]);
                    $existingIds[] = $tugas['id'];
                } else {
                    // Create tugas baru
                    $new = $honorUjian->tugas()->create([
                        'jenis_tugas' => $tugas['jenis_tugas'],
                        'jumlah' => $jumlah,
                        'honor_per_tugas' => $honor_per_tugas,
                        'honor_total' => $honor_total,
                        'tipe_ujian' => $honorUjian->tugas()->first()?->tipe_ujian ?? 'UTS', // fallback jika tidak ada
                    ]);
                    $existingIds[] = $new->id;
                }
            }

            // Hapus tugas yang tidak ada di inputan baru
            $honorUjian->tugas()->whereNotIn('id', $existingIds)->delete();

            return redirect()->back()->with('success', 'Data berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }



    public function destroy($id)
    {
        try {
            $honor = HonorUjian::findOrFail($id);

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
        $honor = HonorUjian::with(['semester', 'tugas'])->findOrFail($id);

        // Load view dan generate PDF
        $pdf = Pdf::loadView('inv-honor-ujian', compact('honor'))
            ->setPaper('a5', 'portrait');

        // Stream file PDF ke browser
        return $pdf->stream('Invoice_Honorarium_Ujian_' . str_replace(' ', '_', $honor->nama) . '.pdf');
    }

    public function laporanPdf(Request $request, $tipeUjian)
    {
        $request->validate([
            'semester' => 'required|exists:semesters,id',
        ]);

        if (!in_array($tipeUjian, ['UAS', 'UTS'])) {
            return redirect()->back()->with('error', 'Tipe ujian tidak valid.');
        }

        $semesterId = $request->semester;

        $honorList = HonorUjian::with('semester', 'tugas')
            ->where('semester_id', $semesterId)
            ->whereHas('tugas', function ($query) use ($tipeUjian) {
                $query->where('tipe_ujian', $tipeUjian);
            })
            ->get();

        if ($honorList->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada data honor untuk semester dan tipe ujian tersebut.');
        }

        $semester = $honorList->first()->semester;

        $pdf = Pdf::loadView('laporan-honor-ujian', [
            'honorList' => $honorList,
            'semester' => $semester,
            'tipeUjian' => $tipeUjian, // jika ingin ditampilkan di view
        ]);

        return $pdf->stream('Laporan_Honor_Ujian_' . $tipeUjian . '_Semester_' . $semester->nama . '.pdf');
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
