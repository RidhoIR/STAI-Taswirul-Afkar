<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = DB::select('SELECT * FROM users');
        return Inertia::render('Admin/User/index', [
            'users' => $users,
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
        // Validasi input form
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // password_confirmation juga diperlukan
            'role' => 'required|string',
        ]);

        // Membuat pengguna baru dan menyimpannya di database
        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // Meng-hash password sebelum menyimpan
            'role' => $validatedData['role'],
        ]);

        // Redirect ke halaman daftar pengguna dengan pesan sukses
        return redirect()->route('admin.user.index')->with('success', 'User created successfully.');
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
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id, // Ensure email is unique except for the current user
            'role' => 'required|string', // Example of updating the user's role
        ]);

        // Execute raw SQL to update the user by ID
        DB::update('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [
            $validated['name'],
            $validated['email'],
            $validated['role'],
            $id
        ]);

        // Redirect with a success message
        return redirect()->route('admin.user.index')->with('success', 'User updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Execute raw SQL to delete the user by ID
        DB::delete('DELETE FROM users WHERE id = ?', [$id]);

        // Redirect with a success message
        return redirect()->route('admin.user.index')->with('success', 'User deleted successfully.');
    }
}
