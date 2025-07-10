<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailJenisPembayaran;
use App\Models\JenisPembayaran;
use App\Models\Mahasiswa;
use App\Models\Semester;
use App\Models\TanggunganPembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $semesters = Semester::get();
        return Inertia::render('Admin/Bendahara/Semester/index', ['semesters' => $semesters]);
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
                'tahun_ajaran' => 'required|string',
                'semester' => 'required|string', // 'Ganjil' atau 'Genap'
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date',
            ]);

            // Simpan semester baru
            $semester = Semester::create($validated);

            // Ambil semua mahasiswa
            $mahasiswaList = Mahasiswa::all();

            // Ambil semua jenis pembayaran
            $jenisPembayaranList = JenisPembayaran::where('is_once', false)->get();

            // Cari semester sebelumnya berdasarkan tahun_ajaran dan semester
            $tahunSebelumnya = $validated['tahun_ajaran'];
            $semesterSebelumnya = $validated['semester'] === 'Genap' ? 'Ganjil' : 'Genap';

            if ($validated['semester'] === 'Ganjil') {
                // Kurangi tahun ajaran jika Ganjil
                // Dari "2024/2025" menjadi "2023/2024"
                $parts = explode('/', $validated['tahun_ajaran']);
                $tahunAwal = ((int)$parts[0]) - 1;
                $tahunAkhir = ((int)$parts[1]) - 1;
                $tahunSebelumnya = "{$tahunAwal}/{$tahunAkhir}";
            }

            // Ambil semester sebelumnya jika ada
            $semesterLama = Semester::where('tahun_ajaran', $tahunSebelumnya)
                ->where('semester', $semesterSebelumnya)
                ->first();

            foreach ($jenisPembayaranList as $jenisPembayaran) {
                $jumlah = 0;

                // Ambil jumlah dari semester sebelumnya jika tersedia
                if ($semesterLama) {
                    $detailLama = DetailJenisPembayaran::where('semester_id', $semesterLama->id)
                        ->where('jenis_pembayaran_id', $jenisPembayaran->id)
                        ->first();

                    if ($detailLama) {
                        $jumlah = $detailLama->jumlah;
                    }
                }

                // Buat detail baru untuk semester ini
                $detail = DetailJenisPembayaran::firstOrCreate([
                    'semester_id' => $semester->id,
                    'jenis_pembayaran_id' => $jenisPembayaran->id,
                ], [
                    'jumlah' => $jumlah,
                ]);

                // Buat tanggungan untuk tiap mahasiswa
                foreach ($mahasiswaList as $mahasiswa) {
                    if ($mahasiswa->jenis_mahasiswa !== 'reguler') {
                        continue; // Hanya mahasiswa reguler yang dibuatkan tanggungan
                    }

                    TanggunganPembayaran::firstOrCreate([
                        'mahasiswa_id' => $mahasiswa->id,
                        'detail_jenis_pembayaran_id' => $detail->id,
                    ], [
                        'status' => 'belum_bayar',
                        'jumlah' => $jumlah,
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Semester dan semua tanggungan pembayaran berhasil dibuat!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
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
            $validated = $request->validate([
                'tahun_ajaran' => 'required|string',
                'semester' => 'required|string',
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date',
            ]);

            $semester = Semester::findOrFail($id);
            $semester->update($validated);

            return redirect()->back()->with('success', 'Semester berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui semester: ' . $e->getMessage());
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $semester = Semester::findOrFail($id);
            $semester->delete();

            return redirect()->back()->with('success', 'Semester berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus semester: ' . $e->getMessage());
        }
    }
}
