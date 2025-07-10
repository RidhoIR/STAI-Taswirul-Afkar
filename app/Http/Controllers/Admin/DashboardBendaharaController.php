<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPembayaran;
use App\Models\Laporan;
use App\Models\Semester;
use App\Models\TanggunganPembayaran;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardBendaharaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $laporans = Laporan::orderBy('periode_awal', 'desc')->get();

        $latestTransactions = Transaksi::with('mahasiswa', 'detail_jenis_pembayaran.jenis_pembayaran')->orderBy('tanggal_pembayaran', 'desc')
            ->limit(15)
            ->get();

        return Inertia::render('Admin/Bendahara/dashboard-bendahara', [
            'laporans' => $laporans,
            'latestTransactions' => $latestTransactions
        ]);
    }

    public function summary(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        $transaksi = DB::table('transaksis')
            ->whereBetween('tanggal_pembayaran', [$start, $end])
            ->sum('jumlah');


        $transaksi_harian = DB::table('transaksi_harians')
            ->whereBetween('tanggal', [$start, $end])
            ->where('jenis', 'pemasukan') // hanya pemasukan
            ->sum('jumlah');

        $anggaran = DB::table('anggarans')
            ->whereBetween('tgl_pencairan', [$start, $end])
            ->sum('jumlah_anggaran_disetujui');

        $honor = DB::table('honorariums')
            ->whereBetween('periode', [$start, $end])
            ->sum('jumlah');

        $honor_skripsi = DB::table('honor_skripsis')
            ->join('honor_skripsi_jobs', 'honor_skripsis.id', '=', 'honor_skripsi_jobs.honor_skripsi_id')
            ->whereBetween('honor_skripsis.tanggal', [$start, $end])
            ->sum('honor_skripsi_jobs.honor_total');

        $honor_proposal = DB::table('honor_proposals')
            ->join('honor_proposal_jobs', 'honor_proposals.id', '=', 'honor_proposal_jobs.honor_proposal_id')
            ->whereBetween('honor_proposals.tanggal', [$start, $end])
            ->sum('honor_proposal_jobs.honor_total');

        $honor_ppl = DB::table('honor_ppls')
            ->join('honor_ppl_jobs', 'honor_ppls.id', '=', 'honor_ppl_jobs.honor_ppl_id')
            ->whereBetween('honor_ppls.tanggal', [$start, $end])
            ->sum('honor_ppl_jobs.honor_total');

        $honor_wisuda = DB::table('honor_wisudas')
            ->whereBetween('tanggal', [$start, $end])
            ->sum('honor_total');

        $honor_ujian = DB::table('honor_ujians')
            ->join('honor_ujian_jobs', 'honor_ujians.id', '=', 'honor_ujian_jobs.honor_ujian_id')
            ->whereBetween('honor_ujians.tanggal', [$start, $end])
            ->sum('honor_ujian_jobs.honor_total');

        $transaksi_harian_pengeluaran = DB::table('transaksi_harians')
            ->whereBetween('tanggal', [$start, $end])
            ->where('jenis', 'pengeluaran') // hanya pengeluaran
            ->sum('jumlah');

        $lastSaldo = Laporan::latest('periode_akhir')->value('saldo_akhir');
        $pemasukan = $transaksi + $transaksi_harian;
        $pengeluaran = $anggaran + $honor + $honor_skripsi + $honor_proposal + $honor_ppl + $honor_wisuda + $honor_ujian + $transaksi_harian_pengeluaran;
        $saldo = $lastSaldo + $pemasukan - $pengeluaran;

        $grafik = [
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran
        ];

        return response()->json([
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'laba_rugi' => $pemasukan - $pengeluaran,
            'grafik' => $grafik,
            'saldo' => $saldo
        ]);
    }

    public function chartBySemester(Request $request)
    {
        $semesterId = $request->input('semester_id');

        $jenisPembayaranList = JenisPembayaran::all();

        $result = [];

        foreach ($jenisPembayaranList as $jenis) {
            $data = TanggunganPembayaran::whereHas('detail_jenis_pembayaran', function ($q) use ($semesterId, $jenis) {
                $q->where('jenis_pembayaran_id', $jenis->id);

                // Filter semester hanya jika tersedia
                if ($semesterId) {
                    $q->where(function ($subQ) use ($semesterId) {
                        $subQ->where('semester_id', $semesterId)
                            ->orWhereNull('semester_id'); // Include non-semester based
                    });
                }
            })
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status');

            $result[] = [
                'jenis' => $jenis->nama_pembayaran,
                'data' => [
                    'lunas' => $data['lunas'] ?? 0,
                    'belum_lunas' => $data['belum_lunas'] ?? 0,
                    'belum_bayar' => $data['belum_bayar'] ?? 0,
                ]
            ];
        }

        return response()->json($result);
    }

    public function barChartData(Request $request)
    {
        $year = $request->input('year', now()->year);

        $data = [];

        foreach (range(1, 12) as $month) {
            $bulanStr = str_pad($month, 2, '0', STR_PAD_LEFT);
            $label = \Carbon\Carbon::create()->month($month)->locale('id')->monthName;

            $transaksi = DB::table('transaksis')
                ->whereYear('tanggal_pembayaran', $year)
                ->whereMonth('tanggal_pembayaran', $month)
                ->sum('jumlah');


            $transaksi_harian = DB::table('transaksi_harians')
                ->whereYear('tanggal', $year)
                ->whereMonth('tanggal', $month)
                ->where('jenis', 'pemasukan') // hanya pemasukan
                ->sum('jumlah');

            $pemasukan = $transaksi + $transaksi_harian;

            $anggaran = DB::table('anggarans')
                ->whereYear('tgl_pencairan', $year)
                ->whereMonth('tgl_pencairan', $month)
                ->sum('jumlah_anggaran_disetujui');

            $honor = DB::table('honorariums')
                ->whereYear('periode', $year)
                ->whereMonth('periode', $month)
                ->sum('jumlah');

            $honor_skripsi = DB::table('honor_skripsis')
                ->join('honor_skripsi_jobs', 'honor_skripsis.id', '=', 'honor_skripsi_jobs.honor_skripsi_id')
                ->whereYear('honor_skripsis.tanggal', $year)
                ->whereMonth('honor_skripsis.tanggal', $month)
                ->sum('honor_skripsi_jobs.honor_total');

            $honor_proposal = DB::table('honor_proposals')
                ->join('honor_proposal_jobs', 'honor_proposals.id', '=', 'honor_proposal_jobs.honor_proposal_id')
                ->whereYear('honor_proposals.tanggal', $year)
                ->whereMonth('honor_proposals.tanggal', $month)
                ->sum('honor_proposal_jobs.honor_total');

            $honor_ppl = DB::table('honor_ppls')
                ->join('honor_ppl_jobs', 'honor_ppls.id', '=', 'honor_ppl_jobs.honor_ppl_id')
                ->whereYear('honor_ppls.tanggal', $year)
                ->whereMonth('honor_ppls.tanggal', $month)
                ->sum('honor_ppl_jobs.honor_total');

            $honor_wisuda = DB::table('honor_wisudas')
                ->whereYear('tanggal', $year)
                ->whereMonth('tanggal', $month)
                ->sum('honor_total');

            $honor_ujian = DB::table('honor_ujians')
                ->join('honor_ujian_jobs', 'honor_ujians.id', '=', 'honor_ujian_jobs.honor_ujian_id')
                ->whereYear('honor_ujians.tanggal', $year)
                ->whereMonth('honor_ujians.tanggal', $month)
                ->sum('honor_ujian_jobs.honor_total');

            $transaksi_harian_pengeluaran = DB::table('transaksi_harians')
                ->whereYear('tanggal', $year)
                ->whereMonth('tanggal', $month)
                ->where('jenis', 'pengeluaran') // hanya pengeluaran
                ->sum('jumlah');

            $pengeluaran = $anggaran + $honor + $honor_skripsi + $honor_proposal + $honor_ppl + $honor_wisuda + $honor_ujian + $transaksi_harian_pengeluaran;


            $data[] = [
                'bulan' => ucfirst($label),
                'pemasukan' => $pemasukan,
                'pengeluaran' => $pengeluaran,
            ];
        }

        return response()->json($data);
    }




    // Route: GET /dashboard/bendahara/chart-filter
    public function chartFilter(Request $request)
    {
        $semesterId = $request->input('semester_id');
        $jenisPembayaranId = $request->input('jenis_pembayaran_id');

        $data = TanggunganPembayaran::whereHas('detail_jenis_pembayaran', function ($q) use ($semesterId, $jenisPembayaranId) {
            $q->where('semester_id', $semesterId)
                ->where('jenis_pembayaran_id', $jenisPembayaranId);
        })
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'data' => [
                'lunas' => $data['lunas'] ?? 0,
                'belum_lunas' => $data['belum_lunas'] ?? 0,
                'belum_bayar' => $data['belum_bayar'] ?? 0,
            ]
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
        //
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
