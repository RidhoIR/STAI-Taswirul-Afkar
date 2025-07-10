<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JabatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jabatans = Jabatan::latest()->get();

        return Inertia::render('Admin/Bendahara/jabatan/index', [
            'jabatans' => $jabatans,
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
                'name' => 'required|string|max:255',
                'honor' => 'required|numeric|min:0',
            ]);

            Jabatan::create($validated);

            return redirect()->back()->with('success', 'Jabatan berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $jabatan = Jabatan::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'honor' => 'required|numeric|min:0',
            ]);

            $jabatan->update($validated);

            return redirect()->back()->with('success', 'Jabatan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $jabatan = Jabatan::findOrFail($id);
            $jabatan->delete();

            return redirect()->back()->with('success', 'Jabatan berhasil dihapus.');
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

    /**
     * Remove the specified resource from storage.
     */
}
