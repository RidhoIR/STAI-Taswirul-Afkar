<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mahasiswas = Mahasiswa::with('semester')->get();

        return Inertia::render('Pengurus/Mahasiswa/index', [
            'mahasiswas' => $mahasiswas,
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
            // Validasi input form
            $validatedData = $request->validate([
                'nim' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'tahun_masuk' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed', // password_confirmation juga diperlukan
            ]);

            // Membuat pengguna baru dan menyimpannya di database
            Mahasiswa::create([
                'nim' => $validatedData['nim'],
                'semester_id' => 1,
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'tahun_masuk' => $validatedData['tahun_masuk'],
                'password' => Hash::make($validatedData['password']), // Meng-hash password sebelum menyimpan
            ]);

            // Redirect ke halaman daftar pengguna dengan pesan sukses
            return redirect()->route('pengurus.mahasiswa.index')->with('success', 'Mahasiswa created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        try{
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id, // Ensure email is unique except for the current user
            'nim' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed', // password_confirmation juga diperlukan
        ]);

        // Execute raw SQL to update the user by ID
        DB::update('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [
            $validated['name'],
            $validated['email'],
            $validated['nim'],
            $validated['password'],
            $id
        ]);

        // Redirect with a success message
        return redirect()->route('pengurus.mahasiswa.index')->with('success', 'User updated successfully.');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', $e->getMessage());
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
