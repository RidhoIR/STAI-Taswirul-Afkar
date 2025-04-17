<?php

use App\Http\Controllers\Admin\AdminLpjController;
use App\Http\Controllers\Admin\AnggaranController as AdminAnggaranController;
use App\Http\Controllers\Admin\JenisPembayaranController;
use App\Http\Controllers\Admin\JenisPembayaranSemesterController;
use App\Http\Controllers\Admin\KeuanganController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\TanggunganPembayaran;
use App\Http\Controllers\Admin\TransaksiController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Pengurus\AnggaranController;
use App\Http\Controllers\Pengurus\LpjController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth:web,mahasiswa', 'verified'])->name('dashboard');

Route::middleware('auth:web,mahasiswa')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth:web,mahasiswa', 'role:admin')->group(function () {
    Route::get('/admin/user', [UserController::class, 'index'])->name('admin.user.index');
    Route::get('/admin/user/{id}', [UserController::class, 'show'])->name('admin.user.show');
    Route::get('/admin/user/create', [UserController::class, 'create'])->name('admin.user.create');
    Route::post('/admin/user', [UserController::class, 'store'])->name('admin.user.store');
    Route::get('/admin/user/{id}/edit', [UserController::class, 'edit'])->name('admin.user.edit');
    Route::put('/admin/user/{id}', [UserController::class, 'update'])->name('admin.user.update');
    Route::delete('/admin/user/{id}', [UserController::class, 'destroy'])->name('admin.user.destroy');
    
    // Admin Pengurus Anggaran
    Route::get('/admin/anggaran/pengurus', [AdminAnggaranController::class, 'index'])->name('admin.anggaran.index');
    Route::put('/admin/anggaran/pengurus/{id}', [AdminAnggaranController::class, 'update'])->name('admin.anggaran.update');
    // Pengurus Laporan
    // Route::get('storage/{file}', [LpjController::class,'download'])->name('pengurus.lpj.download');
    // Admin Pengurus Laporan 
    Route::get('/admin/lpj/pengurus', [AdminLpjController::class, 'index'])->name('admin.lpj.index');
    Route::post('/admin/lpj/pengurus/{id}', [AdminLpjController::class, 'update'])->name('admin.lpj.update');

    //keuangan
});

Route::middleware('auth:web,mahasiswa', 'role:pengurus')->group(function () {
    // Pengurus Anggaran
    Route::get('/pengurus/anggaran', [AnggaranController::class, 'index'])->name('pengurus.anggaran.index');
    Route::post('/pengurus/anggaran', [AnggaranController::class, 'store'])->name('pengurus.anggaran.store');
    Route::get('/storage/{file}', [AnggaranController::class, 'download'])->name('pengurus.anggaran.download');
    Route::put('/pengurus/anggaran/{id}', [AnggaranController::class, 'update'])->name('pengurus.anggaran.update');
    // Pengurus Laporan
    Route::get('/pengurus/lpj', [LpjController::class, 'index'])->name('pengurus.lpj.index');
    Route::post('/pengurus/lpj', [LpjController::class, 'store'])->name('pengurus.lpj.store');
    Route::put('/pengurus/lpj/{id}', [LpjController::class, 'update'])->name('pengurus.lpj.update');

    //Pengurus Mahasiswa
    Route::get('/pengurus/mahasiswa', [MahasiswaController::class, 'index'])->name('pengurus.mahasiswa.index');
    Route::post('/pengurus/mahasiswa', [MahasiswaController::class, 'store'])->name('pengurus.mahasiswa.store');
    Route::put('/pengurus/mahasiswa/{id}', [MahasiswaController::class, 'update'])->name('pengurus.mahasiswa.update');
});

Route::middleware('auth:web,mahasiswa', 'role:bendahara')->group(function () {
    //Admin-Bendahara-Mahasiswa
    Route::get('/admin/bendahara/mahasiswa', [KeuanganController::class, 'index'])->name('admin.bendahara.mahasiswa.index');
    Route::get('/pembayaran/riwayat/{mahasiswa_id}', [KeuanganController::class, 'detailMahasiswa'])->name('admin.bendahara.riwayat-pembayaran.detail-mahasiswa');
    Route::post('/admin/bendahara/mahasiswa/{mahasiswa_id}', [KeuanganController::class, 'tambahPembayaran'])->name('admin.bendahara.mahasiswa.tambah');
    Route::get('/transaksi/{id}/pdf', [KeuanganController::class, 'printPdf'])->name('transaksi.pdf');
    Route::get('/riwayat-pembayaran', [KeuanganController::class, 'riwayatPembayaran'])->name('admin.bendahara.riwayat-pembayaran.index');
    Route::get('/jenis-pembayaran', [JenisPembayaranController::class, 'index'])->name('admin.bendahara.jenis-pembayaran.index');
    Route::post('/jenis-pembayaran', [JenisPembayaranController::class, 'store'])->name('admin.bendahara.jenis-pembayaran.store');
    Route::put('/jenis-pembayaran/{id}', [JenisPembayaranController::class, 'update'])->name('admin.bendahara.jenis-pembayaran.update');
    Route::delete('/jenis-pembayaran/{id}', [JenisPembayaranController::class, 'destroy'])->name('admin.bendahara.jenis-pembayaran.destroy');
    Route::get('/pembayaran/mahasiswa/{id}', [TanggunganPembayaran::class,'tanggunganMahasiswa'])->name('admin.bendahara.tanggungan-mahasiswa.index');
    Route::post('/pembayaran/mahasiswa/{mahasiswa_id}',[TransaksiController::class,'store'])->name('admin.bendahara.transaksi.store');
    Route::get('/jenis-pembayaran/detail',[JenisPembayaranSemesterController::class,'index'])->name('admin.bendahara.detail-jenis-pembayaran.index');
}); 


require __DIR__ . '/auth.php';
