<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
                'no_telp' => 'nullable|string',
                'jenis_mahasiswa' => 'required|string|max:255',
                'tahun_masuk' => 'required|string|max:255',
                'email' => 'nullable|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed', // password_confirmation juga diperlukan
            ]);

            // Membuat pengguna baru dan menyimpannya di database
            Mahasiswa::create([
                'nim' => $validatedData['nim'],
                'name' => $validatedData['name'],
                'no_telp' => $validatedData['no_telp'],
                'jenis_mahasiswa' => $validatedData['jenis_mahasiswa'],
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
        try {
            // Validate the incoming request data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'no_telp' => 'nullable|string',
                'jenis_mahasiswa' => 'required|string|max:255',
                'email' => 'nullable|email|unique:users,email,', // Ensure email is unique except for the current user
                'nim' => 'required|string',
                'password' => 'nullable|string|min:8|confirmed', // password_confirmation juga diperlukan
            ]);

            $mahasiswa = Mahasiswa::findOrFail($id);

            // Execute raw SQL to update the mahasiswa by ID
            $mahasiswa->name = $validated['name'];
            $mahasiswa->email = $validated['email'];
            $mahasiswa->jenis_mahasiswa = $validated['jenis_mahasiswa'];
            $mahasiswa->no_telp = $validated['no_telp'] ?? null;
            $mahasiswa->nim = $validated['nim'];

            if (!empty($validated['password'])) {
                $mahasiswa->password = bcrypt($validated['password']);
            }

            $mahasiswa->save();

            // Redirect with a success message
            return redirect()->route('pengurus.mahasiswa.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function uploadFoto(Request $request)
    {
        try {
            $request->validate([
                'foto' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $user = Auth::user();

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('avatars', 'public');

                // Hapus file lama jika ada
                if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                    Storage::disk('public')->delete($user->foto);
                }

                $user->update([
                    'foto' => $path,
                ]);
            }

            return back()->with('success', 'Foto berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
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
        try {
            $mahasiswa = Mahasiswa::findOrFail($id);
            $mahasiswa->delete();

            return redirect()->back()->with('success', 'Mahasiswa deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
