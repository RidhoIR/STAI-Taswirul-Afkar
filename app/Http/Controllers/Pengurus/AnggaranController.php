<?php

namespace App\Http\Controllers\Pengurus;

use App\Http\Controllers\Controller;
use App\Models\Anggaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Contracts\Service\Attribute\Required;

class AnggaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $year = $request->query('year', date('Y'));
        $tridharmaId = $request->query('tridharma_id');

        $query = DB::table('anggarans')
            ->join('users', 'anggarans.user_id', '=', 'users.id')
            ->join('tridharmas', 'anggarans.tridharma_id', '=', 'tridharmas.id')
            ->select('anggarans.*', 'users.name', 'tridharmas.nama')
            ->where('anggarans.user_id', $userId)
            ->whereYear('anggarans.tgl_pengajuan', $year);

        if ($tridharmaId) {
            $query->where('anggarans.tridharma_id', $tridharmaId);
        }

        $anggarans = $query->get();


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

        $tridharmas = DB::table('tridharmas')->select('id', 'nama')->get();


        return Inertia::render('Pengurus/Anggaran/index', [
            'anggarans' => $anggarans,
            'filterYear' => $year,
            'filterTridharma' => $tridharmaId,
            'availableYears' => $availableYears,
            'tridharmas' => $tridharmas, // Kirim daftar Tridharma ke frontend
        ]);
    }



    public function download($file)
    {
        if (!Auth::check()) {
            return abort(403); // Akses tidak diizinkan
        }
        $path = storage_path('app/public/anggaran_files/' . $file);

        if (!file_exists($path)) {
            return abort(404);
        }

        return response()->download($path);
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
            // Validasi input
            $validated = $request->validate([
                'perihal' => 'required|string|max:255',
                'anggaran' => 'required|file|mimes:pdf,doc,docx|max:5120', // Hanya PDF/Word yang diizinkan
                'jumlah_anggaran' => 'required|string',
                'tridharma_id' => 'required|exists:tridharmas,id',
            ]);

            // Menyimpan file anggaran
            $filePath = null;
            if ($request->hasFile('anggaran')) {
                $filePath = $request->file('anggaran')->store('anggaran_files', 'public');
            }

            // Insert data ke tabel anggarans menggunakan query SQL
            DB::table('anggarans')->insert([
                'user_id' => Auth::id(),
                'tridharma_id' => $validated['tridharma_id'],
                'perihal' => $validated['perihal'],
                'status_anggaran' => 'pending',
                'anggaran' => $filePath,
                'jumlah_anggaran' => $validated['jumlah_anggaran'],
                'tgl_pengajuan' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Berhasil
            return redirect()->back()->with('success', 'Anggaran berhasil diajukan.');
        } catch (\Exception $e) {
            // Catch any exceptions and redirect with error message
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
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
        $anggaran = Anggaran::findOrFail($id);

        $validated = $request->validate([
            'perihal' => 'nullable|string|max:255',
            'anggaran' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'jumlah_anggaran' => 'required|string',
            'tridharma_id' => 'required|exists:tridharmas,id',
        ]);

        $anggaran->perihal = $validated['perihal'] ?? $anggaran->perihal;
        $anggaran->tridharma_id = $validated['tridharma_id'];
        $anggaran->jumlah_anggaran = $validated['jumlah_anggaran'];
        $anggaran->status_anggaran = 'pending';


        // Jika ada file anggaran baru yang diunggah
        if ($request->hasFile('anggaran')) {
            // Hapus file lama jika ada
            if ($anggaran->anggaran) {
                $oldFilePath = storage_path('app/public/' . $anggaran->anggaran);
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath); // Hapus file lama
                }
            }

            // Menyimpan file anggaran baru
            $filePath = $request->file('anggaran')->store('anggaran_files', 'public');
            $anggaran->anggaran = $filePath; // Update path file anggaran
        }

        // Simpan perubahan ke database
        $anggaran->save();

        return redirect()->route('pengurus.anggaran.index')->with('success', 'Anggaran berhasil diperbarui dan diajukan kembali');
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
