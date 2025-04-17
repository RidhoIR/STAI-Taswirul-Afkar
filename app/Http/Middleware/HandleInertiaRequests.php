<?php

namespace App\Http\Middleware;

use App\Models\Anggaran;
use App\Models\lpj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => Auth::guard('web')->user(),
                'mahasiswa' => Auth::guard('mahasiswa')->user(),
            ],
            'flash' => [
                'error' => fn() => $request->session()->get('error'),
                'success' => fn() => $request->session()->get('success'),
            ],
            'anggarans' => fn() => Anggaran::all(),
            'lpj' => fn() => lpj::all(),
            'tridharmas' => fn() => \App\Models\Tridharma::all(),
            'semesters' => fn() => \App\Models\Semester::all(),
            'jenis_pembayaran' => fn() => \App\Models\JenisPembayaran::all(),
            'transaksi' => fn() => \App\Models\Transaksi::all(),
            'mahasiswa' => fn() => \App\Models\Mahasiswa::all(),
            'tanggungan_pembayaran' => fn() => \App\Models\TanggunganPembayaran::all(),
            'jenis_pembayaran_semester' => fn() => \App\Models\JenisPembayaranSemester::all(),
        ];
    }
}
