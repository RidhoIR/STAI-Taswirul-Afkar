<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailJenisPembayaran;
use App\Models\JenisPembayaran;
use App\Models\JenisPembayaranSemester;
use App\Models\Semester;
use App\Models\TanggunganPembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetailJenisPembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenis_pembayaran_semester = DetailJenisPembayaran::with(['jenis_pembayaran', 'semester'])
            ->orderBy('created_at', 'desc')
            ->get();

        $jenis_pembayaran = JenisPembayaran::select('id', 'nama_pembayaran', 'is_once')->get();
        $semesters = Semester::select('id', 'semester', 'tahun_ajaran')->get();

        return Inertia::render('Admin/Bendahara/detail-jenis-pembayaran/index', [
            'jenis_pembayaran_semester' => $jenis_pembayaran_semester,
            'jenis_pembayaran' => $jenis_pembayaran,
            'semesters' => $semesters,
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
                'jenis_pembayaran_id' => 'required|exists:jenis_pembayarans,id',
                'semester_id' => 'nullable|exists:semesters,id', // hanya diperlukan jika is_once = true
                'jumlah' => 'required|numeric|min:0',
            ]);

            $jenisPembayaran = JenisPembayaran::findOrFail($validated['jenis_pembayaran_id']);

            if ($jenisPembayaran->is_once) {
                // Dibayar satu kali saja → hanya untuk semester tertentu
                DetailJenisPembayaran::create([
                    'jenis_pembayaran_id' => $jenisPembayaran->id,
                    'semester_id' => $validated['semester_id'],
                    'jumlah' => $validated['jumlah'],
                ]);
            } else {
                // Dibayar setiap semester
                if (!$validated['semester_id']) {
                    return redirect()->back()->with('error', 'Semester wajib diisi untuk jenis pembayaran rutin.');
                }

                DetailJenisPembayaran::create([
                    'jenis_pembayaran_id' => $jenisPembayaran->id,
                    'semester_id' => $validated['semester_id'],
                    'jumlah' => $validated['jumlah'],
                ]);
            }

            return redirect()->back()->with('success', 'Detail Jenis Pembayaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'jumlah' => 'required|numeric|min:0',
            ]);

            // Temukan data detail jenis pembayaran
            $detail = DetailJenisPembayaran::findOrFail($id);

            // Update hanya jumlahnya
            $detail->update([
                'jumlah' => $validated['jumlah'],
            ]);

            // Opsional: update semua tanggungan mahasiswa yang menggunakan detail ini
            TanggunganPembayaran::where('detail_jenis_pembayaran_id', $detail->id)->update([
                'jumlah' => $validated['jumlah'],
            ]);

            return redirect()->back()->with('success', 'Detail Jenis Pembayaran berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            // Temukan detail jenis pembayaran
            $detail = DetailJenisPembayaran::findOrFail($id);

            // Hapus tanggungan pembayaran yang terkait terlebih dahulu
            TanggunganPembayaran::where('detail_jenis_pembayaran_id', $detail->id)->delete();

            // Hapus data detail jenis pembayaran
            $detail->delete();

            return redirect()->back()->with('success', 'Detail Jenis Pembayaran berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
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


    /**
     * Remove the specified resource from storage.
     */
}
