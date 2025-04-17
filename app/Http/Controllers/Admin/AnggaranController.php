<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Anggaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnggaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // In your controller
    public function index(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $tridharmaId = $request->query('tridharma_id'); // Ambil filter dari request

        $query = DB::table('anggarans')
            ->join('users', 'anggarans.user_id', '=', 'users.id')
            ->join('tridharmas', 'anggarans.tridharma_id', '=', 'tridharmas.id')
            ->select('anggarans.*', 'users.name', 'tridharmas.nama')
            ->whereYear('anggarans.tgl_pengajuan', $year);

        if ($tridharmaId) {
            $query->where('anggarans.tridharma_id', $tridharmaId);
        }

        $anggarans = $query->get();

        // Ambil daftar tahun
        $dbYears = DB::table('anggarans')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        $currentYear = (int)date('Y');
        $futureYears = [$currentYear, $currentYear + 1, $currentYear + 2];
        $availableYears = array_unique(array_merge($dbYears, $futureYears));
        sort($availableYears);

        // Ambil daftar Tridharma
        $tridharmas = DB::table('tridharmas')->select('id', 'nama')->get();

        return Inertia::render('Admin/Pengurus/Anggaran/index', [
            'anggarans' => $anggarans,
            'filterYear' => $year,
            'filterTridharma' => $tridharmaId,
            'availableYears' => $availableYears,
            'tridharmas' => $tridharmas, // Kirim daftar Tridharma ke frontend
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
            $anggaran = Anggaran::findOrFail($id);

            $validated = $request->validate([
                'jumlah_anggaran_disetujui' => 'nullable|string',
                'tgl_disetujui' => 'nullable|date',
                'tgl_pencairan' => 'nullable|string',
                'status_pencairan' => 'nullable|string',
                'status_anggaran' => 'nullable|string',
                'keterangan' => 'nullable|string'
            ]);

            $anggaran->jumlah_anggaran_disetujui = $validated['jumlah_anggaran_disetujui'];
            $anggaran->tgl_pencairan = $validated['tgl_pencairan'];
            $anggaran->status_pencairan = $validated['status_pencairan'];
            $anggaran->status_anggaran = $validated['status_anggaran'];
            $anggaran->keterangan = $validated['keterangan'];
            if ($validated['status_anggaran'] === 'disetujui') {
                $anggaran->tgl_disetujui = now();
            }
            $anggaran->save();

            return redirect()->route('admin.anggaran.index')->with('success', 'Anggaran berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('admin.anggaran.index')->with('error', 'Terjadi kesalahan saat memperbarui anggaran: ' . $e->getMessage());
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
