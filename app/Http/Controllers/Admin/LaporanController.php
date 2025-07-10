<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laporan;
use App\Models\DetailLaporanPemasukan;
use App\Models\DetailLaporanPengeluaran;
use App\Models\Transaksi;
use App\Models\TransaksiHarian;
use App\Models\Anggaran;
use App\Models\Honorarium;
use App\Models\HonorSkripsi;
use App\Models\HonorUjian;
use Illuminate\Support\Facades\DB;
use App\Models\DetailLaporan;
use App\Models\HonorPPL;
use App\Models\HonorProposal;
use App\Models\HonorWisuda;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;


class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $laporans = Laporan::orderBy('periode_awal', 'desc')->get();
        return Inertia::render('Admin/Bendahara/Laporan/index', [
            'laporans' => $laporans,
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
                'periode_awal' => 'required|date',
                'periode_akhir' => 'required|date',
                'saldo_awal' => 'required|integer',
            ]);

            DB::transaction(function () use ($validated) {
                $periode_awal = $validated['periode_awal'];
                $periode_akhir = $validated['periode_akhir'];

                // Ambil total dari masing-masing tabel sumber
                $totals = [
                    'anggaran' => DB::table('anggarans')
                        ->whereBetween('tgl_pencairan', [$periode_awal, $periode_akhir])
                        ->sum('jumlah_anggaran_disetujui'),

                    'honorarium' => DB::table('honorariums')
                        ->whereBetween('periode', [$periode_awal, $periode_akhir])
                        ->sum('jumlah'),

                    'honor_skripsi' => DB::table('honor_skripsis')
                        ->join('honor_skripsi_jobs', 'honor_skripsis.id', '=', 'honor_skripsi_jobs.honor_skripsi_id')
                        ->whereBetween('honor_skripsis.tanggal', [$periode_awal, $periode_akhir])
                        ->sum('honor_skripsi_jobs.honor_total'),

                    'honor_proposal' => DB::table('honor_proposals')
                        ->join('honor_proposal_jobs', 'honor_proposals.id', '=', 'honor_proposal_jobs.honor_proposal_id')
                        ->whereBetween('honor_proposals.tanggal', [$periode_awal, $periode_akhir])
                        ->sum('honor_proposal_jobs.honor_total'),

                    'honor_ppl' => DB::table('honor_ppls')
                        ->join('honor_ppl_jobs', 'honor_ppls.id', '=', 'honor_ppl_jobs.honor_ppl_id')
                        ->whereBetween('honor_ppls.tanggal', [$periode_awal, $periode_akhir])
                        ->sum('honor_ppl_jobs.honor_total'),

                    'honor_wisuda' => DB::table('honor_wisudas')
                        ->whereBetween('tanggal', [$periode_awal, $periode_akhir])
                        ->sum('honor_total'),

                    'honor_ujian' => DB::table('honor_ujians')
                        ->join('honor_ujian_jobs', 'honor_ujians.id', '=', 'honor_ujian_jobs.honor_ujian_id')
                        ->whereBetween('honor_ujians.tanggal', [$periode_awal, $periode_akhir])
                        ->sum('honor_ujian_jobs.honor_total'),

                    'transaksi_harian' => DB::table('transaksi_harians')
                        ->whereBetween('tanggal', [$periode_awal, $periode_akhir])
                        ->where('jenis', 'pengeluaran') // hanya pengeluaran
                        ->sum('jumlah'),
                ];

                $totals2 = [
                    'transaksi' => DB::table('transaksis')
                        ->whereBetween('tanggal_pembayaran', [$periode_awal, $periode_akhir])
                        ->sum('jumlah'),

                    'transaksi_harian' => DB::table('transaksi_harians')
                        ->whereBetween('tanggal', [$periode_awal, $periode_akhir])
                        ->where('jenis', 'pemasukan') // hanya pemasukan
                        ->sum('jumlah'),
                ];

                $total_pemasukan = array_sum($totals2);
                $total_pengeluaran = array_sum($totals);
                $saldo_akhir = $validated['saldo_awal'] + $total_pemasukan - $total_pengeluaran;

                // Simpan laporan utama
                $laporan = Laporan::create([
                    'periode_awal' => $periode_awal,
                    'periode_akhir' => $periode_akhir,
                    'saldo_awal' => $validated['saldo_awal'],
                    'total_pengeluaran' => $total_pengeluaran,
                    'total_pemasukan' => $total_pemasukan, // jika belum dihitung
                    'saldo_akhir' => $saldo_akhir,
                ]);

                // Simpan detail dari masing-masing sumber
                foreach ($totals2 as $sumber => $jumlah) {
                    if ($jumlah > 0) {
                        DetailLaporan::create([
                            'laporan_id' => $laporan->id,
                            'jenis' => 'pemasukan',
                            'sumber' => $sumber,
                            'jumlah' => $jumlah,
                        ]);
                    }
                }

                // Simpan detail dari masing-masing sumber
                foreach ($totals as $sumber => $jumlah) {
                    if ($jumlah > 0) {
                        DetailLaporan::create([
                            'laporan_id' => $laporan->id,
                            'jenis' => 'pengeluaran',
                            'sumber' => $sumber,
                            'jumlah' => $jumlah,
                        ]);
                    }
                }
            });

            return redirect()->back()->with('success', 'Laporan berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $laporan = Laporan::findOrFail($id);
            $laporan->delete();
            return redirect()->back()->with('success', 'Laporan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $laporan = Laporan::findOrFail($id);

        $pemasukan = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pemasukan')
            ->get();

        $pengeluaran = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pengeluaran')
            ->get();

        $total_pemasukan = $pemasukan->sum('jumlah');
        $total_pengeluaran = $pengeluaran->sum('jumlah');

        return Inertia::render('Admin/Bendahara/Laporan/show', [
            'laporan' => $laporan,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'total_pemasukan' => $total_pemasukan,
            'total_pengeluaran' => $total_pengeluaran,
        ]);
    }


    public function sumberDetail($laporanId, $sumber)
    {
        $laporan = Laporan::with('detail_laporans')->findOrFail($laporanId);
        $start = $laporan->periode_awal;
        $end = $laporan->periode_akhir;

        $data = match ($sumber) {
            // 'anggaran' => Anggaran::whereBetween('tgl_pencairan', [$start, $end])->get(),
            'honorarium' => Honorarium::with('jabatan')->whereBetween('periode', [$start, $end])->get(),
            'honor_skripsi' => HonorSkripsi::with(['semester', 'tugas'])->whereBetween('tanggal', [$start, $end])->get(),
            'honor_ujian' => HonorUjian::with('semester', 'tugas')->whereBetween('tanggal', [$start, $end])->get(),
            'honor_proposal' => HonorProposal::with(['semester', 'tugas'])->whereBetween('tanggal', [$start, $end])->get(),
            'honor_ppl' => HonorPPL::with(['semester', 'tugas'])->whereBetween('tanggal', [$start, $end])->get(),
            'honor_wisuda' => HonorWisuda::whereBetween('tanggal', [$start, $end])->get(),
            'transaksi_harian' => TransaksiHarian::whereBetween('tanggal', [$start, $end])
                ->where('jenis', optional($laporan->detail_laporans->firstWhere('sumber', $sumber))->jenis)
                ->get(),
            'transaksi' => Transaksi::with('detail_jenis_pembayaran.jenis_pembayaran', 'detail_jenis_pembayaran.semester')
                ->whereBetween('tanggal_pembayaran', [$start, $end])->get(),
            'anggaran' => Anggaran::with('tridharma')->whereBetween('tgl_pencairan', [$start, $end])->get(),
            default => collect([]),
        };

        $total = match ($sumber) {
            // 'anggaran' => $data->sum('jumlah_anggaran_disetujui'),
            // 'honorarium', 'honor_skripsi', 'honor_ujian' => $data->sum('jumlah'),
            // 'transaksi_harian' => $data->sum('nominal'),
            'honor_skripsi' => $data->sum('jumlah'),
            default => 0,
        };

        return Inertia::render('Admin/Bendahara/Laporan/show-sumber', [
            'laporan' => $laporan,
            'sumber' => Str::title(str_replace('_', ' ', $sumber)),
            'data' => $data,
            'total' => $total,
        ]);
    }

    public function laporanPdf($id)
    {
        Carbon::setLocale('id');
        $laporan = Laporan::findOrFail($id);

        $start = $laporan->periode_awal;
        $end = $laporan->periode_akhir;

        $totalPemasukan = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pemasukan')
            ->sum('jumlah');

        $totalPengeluaran = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pengeluaran')
            ->sum('jumlah');

        $saldoAkhir = $laporan->saldo_awal + $totalPemasukan - $totalPengeluaran;


        // Ambil detail pemasukan & pengeluaran utama (tabel detail_laporan)
        $pemasukan = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pemasukan')
            ->where('sumber', '!=', 'transaksi')
            ->where('sumber', '!=', 'transaksi_harian')
            ->get();

        $pengeluaran = DetailLaporan::where('laporan_id', $id)
            ->where('jenis', 'pengeluaran')
            ->where('sumber', '!=', 'transaksi_harian')
            ->get();

        $pemasukan = $pemasukan->map(function ($item) {
            $cleaned = str_replace('_', ' ', strip_tags($item->sumber)); // hilangkan _ dan tag HTML
            $item->sumber = ucwords($cleaned); // kapital setiap kata
            return $item;
        });

        $pengeluaran = $pengeluaran->map(function ($item) {
            $cleaned = str_replace('_', ' ', strip_tags($item->sumber)); // hilangkan _ dan tag HTML
            $item->sumber = ucwords($cleaned); // kapital setiap kata
            return $item;
        });

        $transaksiHarianPengeluaran = TransaksiHarian::whereBetween('tanggal', [$start, $end])
            ->where('jenis', 'pengeluaran')
            ->get();

        $transaksiHarianPemasukan = TransaksiHarian::whereBetween('tanggal', [$start, $end])
            ->where('jenis', 'pemasukan')
            ->get();

        if ($transaksiHarianPemasukan->count()) {
            $keteranganGabung = '';
            $totalJumlah = 0;

            foreach ($transaksiHarianPemasukan as $item) {
                $keteranganGabung .= '- ' . $item->deskripsi . ' (' . number_format($item->jumlah, 0, ',', '.') . ')<br>';
                $totalJumlah += $item->jumlah;
            }

            $pemasukan->push((object)[
                'sumber' => '<strong>Transaksi Harian: </strong><br>' . $keteranganGabung,
                'jumlah' => $totalJumlah,
            ]);
        }

        if ($transaksiHarianPengeluaran->count()) {
            $keteranganGabung = '';
            $totalJumlah = 0;

            foreach ($transaksiHarianPengeluaran as $item) {
                $keteranganGabung .= '- ' . $item->deskripsi . ' (' . number_format($item->jumlah, 0, ',', '.') . ')<br>';
                $totalJumlah += $item->jumlah;
            }

            $pengeluaran->push((object)[
                'sumber' => '<strong>Transaksi Harian: </strong><br>' . $keteranganGabung,
                'jumlah' => $totalJumlah,
            ]);
        }

        // Total pemasukan per jenis pembayaran (SPP, UTS, dll)
        $jenisPembayaranTotals = DB::table('transaksis')
            ->join('detail_jenis_pembayarans', 'transaksis.detail_jenis_pembayaran_id', '=', 'detail_jenis_pembayarans.id')
            ->join('jenis_pembayarans', 'detail_jenis_pembayarans.jenis_pembayaran_id', '=', 'jenis_pembayarans.id')
            ->whereBetween('tanggal_pembayaran', [$start, $end])
            ->select('jenis_pembayarans.nama_pembayaran as jenis', DB::raw('SUM(transaksis.jumlah) as total'))
            ->groupBy('jenis_pembayarans.nama_pembayaran')
            ->orderBy('jenis_pembayarans.nama_pembayaran')
            ->get();

        // Total pengeluaran honorarium dinamis (jika ada)
        $honorSkripsiTotal = DB::table('honor_skripsis')
            ->join('honor_skripsi_jobs', 'honor_skripsis.id', '=', 'honor_skripsi_jobs.honor_skripsi_id')
            ->whereBetween('honor_skripsis.tanggal', [$start, $end])
            ->sum('honor_skripsi_jobs.honor_total');
        $honorUjianTotal = DB::table('honor_ujians')
            ->join('honor_ujian_jobs', 'honor_ujians.id', '=', 'honor_ujian_jobs.honor_ujian_id')
            ->whereBetween('honor_ujians.tanggal', [$start, $end])
            ->sum('honor_ujian_jobs.honor_total');
        $honorariumTotal = Honorarium::whereBetween('periode', [$start, $end])->sum('jumlah');

        // Disusun hanya yang ada datanya
        $honorTotals = [];

        if ($honorariumTotal > 0) {
            $honorTotals['Honorarium'] = $honorariumTotal;
        }
        if ($honorSkripsiTotal > 0) {
            $honorTotals['Honor Skripsi'] = $honorSkripsiTotal;
        }
        if ($honorUjianTotal > 0) {
            $honorTotals['Honor Ujian'] = $honorUjianTotal;
        }

        // Data lain jika ingin ditampilkan lebih detail (opsional)
        $details = [
            'anggaran' => Anggaran::with('tridharma')
                ->whereBetween('tgl_pencairan', [$start, $end])
                ->get(),
            'transaksi' => Transaksi::with('mahasiswa', 'detail_jenis_pembayaran.jenis_pembayaran')
                ->whereBetween('tanggal_pembayaran', [$start, $end])
                ->get(),
            'transaksi_harian' => TransaksiHarian::whereBetween('tanggal', [$start, $end])->get(),
        ];

        // Kirim ke view untuk dicetak PDF
        $pdf = Pdf::loadView('laporan-keuangan', [
            'laporan' => $laporan,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'jenisPembayaranTotals' => $jenisPembayaranTotals,
            'honorTotals' => $honorTotals,
            'details' => $details,
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'saldoAkhir' => $saldoAkhir,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('laporan-keuangan-' . $laporan->periode_awal . '-' . $laporan->periode_akhir . '.pdf');
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
}
