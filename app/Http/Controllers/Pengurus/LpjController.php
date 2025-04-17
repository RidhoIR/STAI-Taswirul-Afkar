<?php

namespace App\Http\Controllers\Pengurus;

use App\Http\Controllers\Controller;
use App\Models\Anggaran;
use App\Models\lpj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LpjController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // Retrieve LPJs based on user's anggaran
        $lpjs = Lpj::whereHas('anggaran', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with('anggaran.user')->get();

        // Retrieve anggarans that belong to the user
        $anggarans = Anggaran::where('user_id', $userId)->get();

        return Inertia::render('Pengurus/Laporan/index', [
            'lpjs' => $lpjs,
            'anggarans' => $anggarans, // Pass the filtered anggarans to the view
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $userId = Auth::id();

        // Fetch only the anggarans related to the authenticated user
        $anggarans = Anggaran::where('user_id', $userId)->get();

        return Inertia::render('Pengurus/Laporan/index', [
            'anggarans' => $anggarans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'id_anggaran' => 'required|exists:anggarans,id',
                'file_laporan' => 'required|mimes:pdf,doc,docx|max:2048', // Accept PDF/Word files
                'foto_dokumentasi' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'narasi' => 'required|string',
                'tgl_diterima' => 'nullable|date'
            ]);

            // Handle file upload for file_laporan
            if ($request->hasFile('file_laporan')) {
                $fileName = time() . '_' . $request->file('file_laporan')->getClientOriginalName();
                $filePath = $request->file('file_laporan')->storeAs('file_laporan', $fileName, 'public');
            }

            // Handle file upload for foto_dokumentasi
            if ($request->hasFile('foto_dokumentasi')) {
                $fotoName = time() . '_' . $request->file('foto_dokumentasi')->getClientOriginalName();
                $fotoPath = $request->file('foto_dokumentasi')->storeAs('foto_dokumentasi', $fotoName, 'public');
            }

            // Create the Lpj entry
            Lpj::create([
                'id_anggaran' => $request->id_anggaran,
                'file_laporan' => $filePath, // store the path of the uploaded file
                'foto_dokumentasi' => $fotoPath, // store the path of the uploaded image
                'narasi' => $request->narasi,
                'tgl_pengajuan' => now()
            ]);

            return redirect()->route('pengurus.lpj.index')->with('success', 'Laporan Pertanggungjawaban created successfully.');
        } catch (\Exception $e) {
            // Menangani kesalahan dan mengirim pesan error ke halaman
            return redirect()->route('pengurus.lpj.index')->with('error', 'Terjadi kesalahan saat memperbarui anggaran: ' . $e->getMessage());
        }
    }

    public function download($file)
    {
        if (!Auth::check()) {
            return abort(403); // Akses tidak diizinkan
        }
        $path = storage_path('app/public/file_laporan/' . $file);

        if (!file_exists($path)) {
            return abort(404);
        }

        return response()->download($path);
    }

    public function update(Request $request, $id)
    {
        try {
            // Find the LPJ by its ID
            $validatedData = $request->validate([
                'id_anggaran' => 'required|exists:anggarans,id',
                'file_laporan' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
                'file_dokumentasi' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
                'narasi' => 'required|string',
            ]);

            // Temukan LPJ berdasarkan ID
            $lpj = Lpj::findOrFail($id);

            // Update LPJ
            $lpj->id_anggaran = $validatedData['id_anggaran'];
            $lpj->narasi = $validatedData['narasi'];

            // Menangani file jika diupload
            if ($request->hasFile('file_laporan')) {
                // Simpan file dan update path di database
                $lpj->file_laporan = $request->file('file_laporan')->store('laporan');
            }

            if ($request->hasFile('file_dokumentasi')) {
                // Simpan file dan update path di database
                $lpj->file_dokumentasi = $request->file('file_dokumentasi')->store('dokumentasi');
            }

            // Simpan perubahan
            $lpj->save();

            // Redirect back with a success message
            return redirect()->back()->with('success', 'Laporan berhasil diperbarui.');
        } catch (\Exception $e) {            // Handle the exception and redirect with an error message
            return redirect()->route('pengurus.lpj.index')->with('error', 'Gagal memperbarui laporan: ' . $e->getMessage());
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
    public function destroy(string $id)
    {
        //
    }
}
