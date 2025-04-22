<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailJenisPembayaran;
use App\Models\Jenis_Pembayaran;
use App\Models\JenisPembayaran;
use App\Models\Mahasiswa;
use App\Models\Semester;
use App\Models\Transaksi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KeuanganController extends Controller
{

    public function index()
    {
        // Ambil semua mahasiswa
        $mahasiswas = Mahasiswa::all();

        // Kirim data mahasiswa ke frontend
        return Inertia::render('Admin/Bendahara/Mahasiswa/Index/index', [
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function riwayatPembayaran()
    {
        // Ambil semua mahasiswa
        $transaksi = Transaksi::with(['mahasiswa', 'jenis_pembayaran', 'semester'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Kirim data mahasiswa ke frontend
        return Inertia::render('Admin/Bendahara/riwayat-pembayaran/index', [
            'transaksi' => $transaksi,
        ]);
    }

    public function detailMahasiswa($mahasiswa_id)
    {
        $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);
        $detail_jenis_pembayaran = DetailJenisPembayaran::with('jenis_pembayaran')->get();

        $transaksi = $mahasiswa->transaksi()
            ->with(['detail_jenis_pembayaran.jenis_pembayaran', 'detail_jenis_pembayaran.semester', 'user']) // load relasi yang dibutuhkan
            ->orderBy('created_at', 'desc') // FIFO berdasarkan tanggal_pembayaran
            ->get();
        $tanggungan_pembayaran = $mahasiswa->tanggungan_pembayaran()
            ->with(['detail_jenis_pembayaran.jenis_pembayaran', 'detail_jenis_pembayaran.semester',  'mahasiswa']) // load relasi yang dibutuhkan
            ->orderBy('created_at', 'desc') // FIFO berdasarkan tanggal_pembayaran
            ->get();
        return Inertia::render('Admin/Bendahara/Mahasiswa/detail-mahasiswa/index', [
            'mahasiswa' => $mahasiswa,
            'transaksi' => $transaksi, // ini sudah diurutkan dengan benar
            'tanggungan_pembayaran' => $tanggungan_pembayaran,
            'detail_jenis_pembayaran' => $detail_jenis_pembayaran,
        ]);
    }


    // **2. Menampilkan Pembayaran yang Belum Dibayar per Semester**
    // public function pembayaranBelumLunas($mahasiswa_id, $semester_id)
    // {
    //     $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);
    //     $semester = Semester::findOrFail($semester_id);

    //     // Mendapatkan pembayaran yang belum lunas pada semester tertentu
    //     $belumLunas = Jenis_Pembayaran::whereDoesntHave('transaksis', function ($query) use ($mahasiswa_id, $semester_id) {
    //         $query->where('mahasiswa_id', $mahasiswa_id)
    //             ->where('semester_id', $semester_id)
    //             ->where('status_pembayaran', 'lunas');
    //     })->get();

    //     return view('pembayaran.belum-lunas', compact('mahasiswa', 'semester', 'belumLunas'));
    // }

    // **3. Mencari Mahasiswa Berdasarkan NIM atau Nama**
    public function cariMahasiswa(Request $request)
    {
        $query = $request->input('query');
        $mahasiswas = Mahasiswa::where('nim', 'LIKE', "%{$query}%")
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->get();

        return view('pembayaran.cari-mahasiswa', compact('mahasiswas'));
    }

    // **4. Form Transaksi Pembayaran**
    public function formPembayaran($mahasiswa_id)
    {
        $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);
        $jenisPembayarans = JenisPembayaran::all();
        $semesters = Semester::all();

        return view('pembayaran.form', compact('mahasiswa', 'jenisPembayarans', 'semesters'));
    }

    // **5. Proses Transaksi Pembayaran**
    public function tambahPembayaran(Request $request, $mahasiswa_id)
    {
        try {
            $userId = Auth::id();

            $request->validate([
                'jenis_pembayaran_id' => 'required|exists:jenis_pembayarans,id',
                'jumlah' => 'required|numeric|min:0',
                'deskripsi' => 'nullable|string',
            ]);

            $jenisPembayaran = JenisPembayaran::findOrFail($request->jenis_pembayaran_id);
            $mahasiswa = Mahasiswa::findOrFail($mahasiswa_id);

            // Generate No Invoice dengan UUID/random string
            $noInvoice = 'INV-' . Str::upper(Str::random(10));

            // Deskripsi otomatis jika tidak diisi
            $deskripsi = $request->deskripsi ?? "Pembayaran {$jenisPembayaran->nama_pembayaran} oleh {$mahasiswa->nama}";

            Transaksi::create([
                'no_invoice' => $noInvoice,
                'user_id' => $userId,
                'mahasiswa_id' => $mahasiswa_id,
                'jenis_pembayaran_id' => $request->jenis_pembayaran_id,
                'semester_id' => 1, // atau bisa pakai dari form nanti
                'jumlah' => $request->jumlah,
                'tanggal_pembayaran' => now(),
                'deskripsi' => $deskripsi,
            ]);

            return redirect()->route('admin.bendahara.riwayat-pembayaran.detail-mahasiswa', $mahasiswa_id)->with('success', 'Pembayaran berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function printPdf($id)
    {
        $transaksi = Transaksi::firstOrFail();

        $kembali = $transaksi->jumlah - $transaksi->detail_jenis_pembayaran->jumlah;

        $data = [
            'noInvoice' => $transaksi->no_invoice,
            'tanggalPembayaran' => $transaksi->tanggal_pembayaran,
            'nama' => $transaksi->mahasiswa->name,
            'nim' => $transaksi->mahasiswa->nim,
            'semester' => $transaksi->detail_jenis_pembayaran->semester->semester,
            'tahun' => $transaksi->detail_jenis_pembayaran->semester->tahun_ajaran,
            'admin' => $transaksi->user->name,
            'jenisPembayaran' => $transaksi->detail_jenis_pembayaran->jenis_pembayaran->nama_pembayaran,
            'jumlah' => $transaksi->jumlah,
            'subtotal' => $transaksi->jumlah,
            'harga' => $transaksi->detail_jenis_pembayaran->jumlah,
            'deskripsi' => $transaksi->deskripsi,
            'kembali' => $kembali
        ];

        $pdf = Pdf::loadView('transaksi', $data)->setPaper('a5', 'portrait');
        return $pdf->stream('transaksi_' . $transaksi->id . '.pdf');
    }


    // **6. Menampilkan Invoice Pembayaran**
    public function invoice($no_invoice)
    {
        $transaksi = Transaksi::where('no_invoice', $no_invoice)->firstOrFail();
        return view('pembayaran.invoice', compact('transaksi'));
    }
}
