<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisPembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenis_pembayaran = JenisPembayaran::all();
        return Inertia::render('Admin/Bendahara/jenis-pembayaran/index', [
            'jenis_pembayaran' => $jenis_pembayaran,
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
                'nama_pembayaran' => 'required|string|max:255',
                'is_once' => 'nullable|boolean',
            ]);

            JenisPembayaran::create([
                'nama_pembayaran' => $validated['nama_pembayaran'],
                'is_once' => $validated['is_once'] ?? false,
            ]);

            return redirect()->route('admin.bendahara.jenis-pembayaran.index')
                ->with('success', 'Jenis pembayaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'nama_pembayaran' => 'required|string|max:255',
                'is_once' => 'nullable|boolean',
            ]);

            $jenisPembayaran = JenisPembayaran::findOrFail($id);
            $jenisPembayaran->update([
                'nama_pembayaran' => $validated['nama_pembayaran'],
                'is_once' => $validated['is_once'] ?? false,
            ]);

            return redirect()->back()->with('success', 'Data berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }


    public function destroy($id)
    {
        try {
            // Find the record by ID
            $jenisPembayaran = JenisPembayaran::findOrFail($id);

            // Delete the record
            $jenisPembayaran->delete();

            // Return a response (redirect or a JSON response)
            return redirect()->route('admin.bendahara.jenis-pembayaran.index')
                ->with('success', 'Jenis Pembayaran berhasil dihapus!');
        } catch (\Exception $e) {
            // Handle any exceptions, like if the record is not found or deletion fails
            return redirect()->route('admin.bendahara.jenis-pembayaran.index')
                ->with('error', 'Gagal menghapus Jenis Pembayaran.');
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
