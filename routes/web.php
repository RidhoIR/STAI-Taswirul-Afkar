<?php

use App\Http\Controllers\Admin\AdminLpjController;
use App\Http\Controllers\Admin\AnggaranController as AdminAnggaranController;
use App\Http\Controllers\Admin\DashboardBendaharaController;
use App\Http\Controllers\Admin\DetailJenisPembayaranController;
use App\Http\Controllers\Admin\HonorariumController;
use App\Http\Controllers\Admin\HonorPplController;
use App\Http\Controllers\Admin\HonorProposalController;
use App\Http\Controllers\Admin\HonorSkripsiController;
use App\Http\Controllers\Admin\HonorUjianController;
use App\Http\Controllers\Admin\HonorWisudaController;
use App\Http\Controllers\Admin\JabatanController;
use App\Http\Controllers\Admin\JenisPembayaranController;
use App\Http\Controllers\Admin\JenisPembayaranSemesterController;
use App\Http\Controllers\Admin\KeuanganController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\SemesterController;
use App\Http\Controllers\Admin\TanggunganPembayaran;
use App\Http\Controllers\Admin\TransaksiController;
use App\Http\Controllers\Admin\TransaksiHarianController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardDosenController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Mahasiswa\KartuUjianController;
use App\Http\Controllers\Mahasiswa\MahasiswaTanggunganController;
use App\Http\Controllers\Mahasiswa\ProfileController as MahasiswaProfileController;
use App\Http\Controllers\Mahasiswa\TransaksiController as MahasiswaTransaksiController;
use App\Http\Controllers\Mahasiswa\DashboardMahasiswaController;
use App\Http\Controllers\Pengurus\AnggaranController;
use App\Http\Controllers\Pengurus\LpjController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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
    $user = Auth::user();

    // Kalau yang login adalah Mahasiswa (guard mahasiswa)
    // Cek kalau yang login adalah mahasiswa
    if (Auth::guard('mahasiswa')->check()) {
        return redirect()->route('mahasiswa.dashboard');
    }

    // Kalau pakai guard web, cek rolenya
    if ($user) {
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->hasRole('pengurus')) {
            return redirect()->route('dashboard.dosen');
        } elseif ($user->hasRole('bendahara')) {
            return redirect()->route('bendahara.dashboard');
        } else {
            // fallback jika role tidak dikenali
            abort(403, 'Role tidak dikenali.');
        }
    }

    // fallback jika tidak ada user
    abort(403, 'User tidak ditemukan.');
})->middleware(['auth:web,mahasiswa', 'verified'])->name('dashboard');

Route::middleware('auth:web,mahasiswa')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/validasi-kartu/{id}/{tipe}/{semester?}', [KartuUjianController::class, 'validasi'])->name('kartu.validasi');


Route::middleware('auth:mahasiswa')->group(function () {
    Route::get('/mahasiswa/profile', [MahasiswaProfileController::class, 'index'])->name('mahasiswa.profile.index');
    Route::post('/mahasiswa/upload-foto', [MahasiswaController::class, 'uploadFoto'])->name('mahasiswa.uploadFoto');
    Route::get('/mahasiswa/transaksi/', [MahasiswaTransaksiController::class, 'index'])->name('mahasiswa.transaksi.index');
    Route::get('/mahasiswa/tanggungan-pembayaran/', [MahasiswaTanggunganController::class, 'index'])->name('mahasiswa.tanggungan-pembayaran.index');
    Route::get('/mahasiswa/kartu-ujian', [KartuUjianController::class, 'index'])->name('mahasiswa.kartu-ujian.index');
    Route::get('kartu-ujian/cetak/{tipe}/{semester_id}', [KartuUjianController::class, 'cetak'])->name('mahasiswa.kartu-ujian.cetak');
    Route::get('/mahasiswa/kartu-proposal', [KartuUjianController::class, 'cetakProposal'])->name('mahasiswa.kartu-ujian.proposal');
    Route::get('/mahasiswa/kartu-skripsi', [KartuUjianController::class, 'cetakSkripsi'])->name('mahasiswa.kartu-ujian.skripsi');
    Route::get('/mahasiswa/dashboard', [DashboardMahasiswaController::class, 'index'])->name('mahasiswa.dashboard');
});

Route::middleware('auth:web', 'role:admin')->group(function () {

    Route::get('/admin/dashboard', [DashboardAdminController::class, 'index'])->name('admin.dashboard');

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

    Route::get('/admin/mahasiswa', [MahasiswaController::class, 'index'])->name('pengurus.mahasiswa.index');
    Route::post('/admin/mahasiswa', [MahasiswaController::class, 'store'])->name('pengurus.mahasiswa.store');
    Route::put('/admin/mahasiswa/{id}', [MahasiswaController::class, 'update'])->name('pengurus.mahasiswa.update');
    Route::delete('/admin/mahasiswa/{id}', [MahasiswaController::class, 'destroy'])->name('pengurus.mahasiswa.destroy');

    //keuangan
});

Route::middleware('auth:web', 'role:pengurus')->group(function () {
    // Pengurus Anggaran
    Route::get('/pengurus/anggaran', [AnggaranController::class, 'index'])->name('pengurus.anggaran.index');
    Route::post('/pengurus/anggaran', [AnggaranController::class, 'store'])->name('pengurus.anggaran.store');
    Route::get('/storage/{file}', [AnggaranController::class, 'download'])->name('pengurus.anggaran.download');
    Route::put('/pengurus/anggaran/{id}', [AnggaranController::class, 'update'])->name('pengurus.anggaran.update');
    // Pengurus Laporan
    Route::get('/pengurus/lpj', [LpjController::class, 'index'])->name('pengurus.lpj.index');
    Route::post('/pengurus/lpj', [LpjController::class, 'store'])->name('pengurus.lpj.store');
    Route::put('/pengurus/lpj/{id}', [LpjController::class, 'update'])->name('pengurus.lpj.update');

    Route::get('/dashboard/dosen', [DashboardDosenController::class, 'index'])->name('dashboard.dosen');
    //Pengurus Mahasiswa

});

Route::middleware('auth:web', 'role:bendahara')->group(function () {
    //Admin-Bendahara-Mahasiswa
    Route::get('/bendahara/dashboard', [DashboardBendaharaController::class, 'index'])->name('bendahara.dashboard');
    Route::get('/dashboard/bendahara/chart-filter', [DashboardBendaharaController::class, 'bendahara.chartFilter']);
    Route::get('/dashboard/bendahara/summary', [DashboardBendaharaController::class, 'summary']);
    Route::get('/dashboard/bendahara/chart-by-semester', [DashboardBendaharaController::class, 'chartBySemester']);
    Route::get('/dashboard/bendahara/bar-chart-data', [DashboardBendaharaController::class, 'barChartData']);



    Route::get('/admin/bendahara/mahasiswa', [KeuanganController::class, 'index'])->name('admin.bendahara.mahasiswa.index');
    Route::get('/pembayaran/riwayat/{mahasiswa_id}', [KeuanganController::class, 'detailMahasiswa'])->name('admin.bendahara.riwayat-pembayaran.detail-mahasiswa');
    Route::post('/admin/bendahara/mahasiswa/{mahasiswa_id}', [KeuanganController::class, 'tambahPembayaran'])->name('admin.bendahara.mahasiswa.tambah');
    Route::get('/transaksi/{id}/pdf', [KeuanganController::class, 'printPdf'])->name('transaksi.pdf');
    Route::get('/riwayat-pembayaran', [KeuanganController::class, 'riwayatPembayaran'])->name('admin.bendahara.riwayat-pembayaran.index');

    Route::get('/jenis-pembayaran', [JenisPembayaranController::class, 'index'])->name('admin.bendahara.jenis-pembayaran.index');
    Route::post('/jenis-pembayaran', [JenisPembayaranController::class, 'store'])->name('admin.bendahara.jenis-pembayaran.store');
    Route::put('/jenis-pembayaran/{id}', [JenisPembayaranController::class, 'update'])->name('admin.bendahara.jenis-pembayaran.update');
    Route::delete('/jenis-pembayaran/{id}', [JenisPembayaranController::class, 'destroy'])->name('admin.bendahara.jenis-pembayaran.destroy');
    Route::get('/pembayaran/mahasiswa/{id}', [TanggunganPembayaran::class, 'tanggunganMahasiswa'])->name('admin.bendahara.tanggungan-mahasiswa.index');
    Route::post('/pembayaran/mahasiswa/{mahasiswa_id}', [TransaksiController::class, 'store'])->name('admin.bendahara.transaksi.store');
    Route::get('/jenis-pembayaran/detail', [DetailJenisPembayaranController::class, 'index'])->name('admin.bendahara.detail-jenis-pembayaran.index');
    Route::post('/jenis-pembayaran/detail', [DetailJenisPembayaranController::class, 'store'])->name('admin.bendahara.detail-jenis-pembayaran.store');
    Route::put('/jenis-pembayaran/detail/{id}', [DetailJenisPembayaranController::class, 'update'])->name('admin.bendahara.detail-jenis-pembayaran.update');
    Route::delete('/jenis-pembayaran/detail/{id}', [DetailJenisPembayaranController::class, 'destroy'])->name('admin.bendahara.detail-jenis-pembayaran.destroy');
    Route::get('/Honorarium', [HonorariumController::class, 'index'])->name('admin.bendahara.honorarium.index');
    Route::post('/honorarium/copy', [HonorariumController::class, 'copyFromPreviousMonth'])->name('admin.bendahara.honorarium.copy');
    Route::post('/honorarium', [HonorariumController::class, 'store'])->name('admin.bendahara.honorarium.store');
    Route::put('/honorarium/{id}', [HonorariumController::class, 'update'])->name('admin.bendahara.honorarium.update');
    Route::delete('/honorarium/{id}', [HonorariumController::class, 'destroy'])->name('admin.bendahara.honorarium.destroy');
    Route::get('/honorarium/pdf', [HonorariumController::class, 'exportPdf'])->name('admin.bendahara.honorarium.pdf');
    Route::get('/honorarium/slip-gaji/{id}', [HonorariumController::class, 'exportSlip'])->name('admin.bendahara.honorarium.slip');

    Route::get('/HonorSkripsi', [HonorSkripsiController::class, 'index'])->name('admin.bendahara.honor-skripsi.index');
    Route::post('/honor-skripsi', [HonorSkripsiController::class, 'store'])->name('admin.bendahara.honor-skripsi.store');
    Route::put('/honor-skripsi/{honor_skripsi}', [HonorSkripsiController::class, 'update'])->name('admin.bendahara.honor-skripsi.update');
    Route::delete('/honor-skripsi/{id}', [HonorSkripsiController::class, 'destroy'])->name('admin.bendahara.honor-skripsi.destroy');
    Route::get('/honor-skripsi/invoice/{id}', [HonorSkripsiController::class, 'invoicePdf'])->name('admin.bendahara.honor-skripsi.invoice');
    Route::get('/honor-skripsi/export-laporan', [HonorSkripsiController::class, 'laporanPdf'])->name('admin.bendahara.honor-skripsi.laporan');

    Route::prefix('honor-proposal')->name('admin.bendahara.honor-proposal.')->group(function () {
        Route::get('/', [HonorProposalController::class, 'index'])->name('index');
        Route::post('/', [HonorProposalController::class, 'store'])->name('store');
        Route::put('/{honor_proposal}', [HonorProposalController::class, 'update'])->name('update');
        Route::delete('/{id}', [HonorProposalController::class, 'destroy'])->name('destroy');
        Route::get('/invoice/{id}', [HonorProposalController::class, 'invoicePdf'])->name('invoice');
        Route::get('/export-laporan', [HonorProposalController::class, 'laporanPdf'])->name('laporan');
    });

    Route::get('/transaksi-harian/pengeluaran', [TransaksiHarianController::class, 'indexPengeluaran'])->name('admin.bendahara.transaksi-harian.pengeluaran.index');
    Route::get('/transaksi-harian/pemasukan', [TransaksiHarianController::class, 'indexPemasukan'])->name('admin.bendahara.transaksi-harian.pemasukan.index');
    Route::post('/transaksi-harian/pengeluaran', [TransaksiHarianController::class, 'storePengeluaran'])->name('admin.bendahara.transaksi-harian.pengeluaran.store');
    Route::post('/transaksi-harian/pemasukan', [TransaksiHarianController::class, 'storePemasukan'])->name('admin.bendahara.transaksi-harian.pemasukan.store');
    Route::put('/transaksi-harian/pengeluaran/{id}', [TransaksiHarianController::class, 'update'])->name('admin.bendahara.transaksi-harian.update');
    Route::delete('/transaksi-harian/{id}', [TransaksiHarianController::class, 'destroy'])->name('admin.bendahara.transaksi-harian.destroy');

    // Route::get('/honor-ujian', [HonorUjianController::class, 'index'])->name('admin.bendahara.honor-ujian.index');
    Route::prefix('honor-ujian')->name('admin.bendahara.honor-ujian.')->group(function () {
        Route::get('/uas', [HonorUjianController::class, 'indexUas'])->name('uas.index');
        Route::get('/uts', [HonorUjianController::class, 'indexUts'])->name('uts.index');
        Route::put('/uts/{honor_ujian}', [HonorUjianController::class, 'updateUas'])->name('uas.update');
        Route::put('/uas/{honor_ujian}', [HonorUjianController::class, 'updateUts'])->name('uts.update');
        // Route::post('/', [HonorUjianController::class, 'store'])->name('store');
        Route::post('/uas', [HonorUjianController::class, 'storeUas'])->name('uas.store');
        Route::post('/uts', [HonorUjianController::class, 'storeUts'])->name('uts.store');
        Route::delete('/{id}', [HonorUjianController::class, 'destroy'])->name('destroy');
        Route::get('/invoice/{id}', [HonorUjianController::class, 'invoicePdf'])->name('invoice');
        Route::get('/export-laporan/{tipe_ujian}', [HonorUjianController::class, 'laporanPdf'])->name('laporan');
    });

    Route::prefix('honor-ppl')->name('admin.bendahara.honor-ppl.')->group(function () {
        Route::get('/', [HonorPplController::class, 'index'])->name('index');
        Route::put('/{honor_ppl}', [HonorPplController::class, 'update'])->name('update');
        Route::post('/', [HonorPplController::class, 'store'])->name('store');
        Route::delete('/{id}', [HonorPplController::class, 'destroy'])->name('destroy');
        Route::get('/invoice/{id}', [HonorPplController::class, 'invoicePdf'])->name('invoice');
        Route::get('/export-laporan', [HonorPplController::class, 'laporanPdf'])->name('laporan');
    });

    Route::prefix('honor-wisuda')->name('admin.bendahara.honor-wisuda.')->group(function () {
        Route::get('/', [HonorWisudaController::class, 'index'])->name('index');
        Route::put('/{id}', [HonorWisudaController::class, 'update'])->name('update');
        Route::post('/', [HonorWisudaController::class, 'store'])->name('store');
        Route::delete('/{id}', [HonorWisudaController::class, 'destroy'])->name('destroy');
        Route::get('/invoice/{id}', [HonorWisudaController::class, 'invoicePdf'])->name('invoice');
        Route::get('/export-laporan', [HonorWisudaController::class, 'laporanPdf'])->name('laporan');
    });

    Route::post('/laporan', [LaporanController::class, 'store'])->name('admin.bendahara.laporan.store');
    Route::get('/laporan', [LaporanController::class, 'index'])->name('admin.bendahara.laporan.index');
    Route::delete('/laporan/{id}', [LaporanController::class, 'destroy'])->name('admin.bendahara.laporan.destroy');
    Route::get('/laporan/detail/{id}', [LaporanController::class, 'show'])->name('admin.bendahara.laporan.show');
    Route::get('/laporan/{laporan}/sumber/{sumber}', [LaporanController::class, 'sumberDetail'])->name('admin.bendahara.laporan.sumber.detail');
    Route::get('/laporan-keuangan/{id}', [LaporanController::class, 'laporanPdf'])->name('admin.bendahara.laporan-keuangan.pdf');

    Route::get('/honor-jabatan', [JabatanController::class, 'index'])->name('admin.bendahara.honor-jabatan.index');
    Route::post('/honor-jabatan', [JabatanController::class, 'store'])->name('admin.bendahara.honor-jabatan.store');
    Route::put('/honor-jabatan/{id}', [JabatanController::class, 'update'])->name('admin.bendahara.honor-jabatan.update');
    Route::delete('/honor-jabatan/{id}', [JabatanController::class, 'destroy'])->name('admin.bendahara.honor-jabatan.destroy');

    Route::get('/semester', [SemesterController::class, 'index'])->name('admin.bendahara.semester.index');
    Route::post('/semester', [SemesterController::class, 'store'])->name('admin.bendahara.semester.store');
    Route::put('/semester/{id}', [SemesterController::class, 'update'])->name('admin.bendahara.semester.update');
    Route::delete('/semester/{id}', [SemesterController::class, 'destroy'])->name('admin.bendahara.semester.destroy');
});


require __DIR__ . '/auth.php';
