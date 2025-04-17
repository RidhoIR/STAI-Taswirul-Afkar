<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use App\Http\Controllers\Controller;


class MahasiswaAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/MahasiswaLogin');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required', // Bisa NIM atau Email
            'password' => 'required',
        ]);

        // Cek apakah input adalah email atau NIM
        $fieldType = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'nim';

        // Coba login dengan guard 'mahasiswa'
        if (Auth::guard('mahasiswa')->attempt([$fieldType => $credentials['login'], 'password' => $credentials['password']])) {
            return redirect()->route('dashboard');
        }

        return back()->withErrors(['login' => 'NIM/Email atau password salah']);
    }

    public function logout()
    {
        Auth::guard('mahasiswa')->logout();
        return redirect('login-mahasiswa');
    }
}
