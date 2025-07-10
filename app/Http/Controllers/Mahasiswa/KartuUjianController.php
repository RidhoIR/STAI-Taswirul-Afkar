<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Semester;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class KartuUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        // Ambil semua semester untuk UTS dan UAS
        $semesters = Semester::orderBy('tahun_ajaran', 'desc')
            ->orderBy('semester', 'desc')
            ->get();

        // Cek status pembayaran UTS dan UAS untuk tiap semester
        $statusPembayaranList = $semesters->map(function ($semester) use ($mahasiswa) {
            $statusUTS = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'UTS');
                        });
                })->first()?->status ?? 'belum_bayar';

            $statusUAS = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'UAS');
                        });
                })->first()?->status ?? 'belum_bayar';

            return [
                'semester_id' => $semester->id,
                'semester' => $semester->semester,
                'tahun_ajaran' => $semester->tahun_ajaran,
                'status_uts' => $statusUTS,
                'status_uas' => $statusUAS,
            ];
        });

        // Tambahkan status pembayaran Proposal (tanpa semester)
        $statusProposal = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran.jenis_pembayaran', function ($query) {
                $query->where('nama_pembayaran', 'Proposal');
            })->first()?->status ?? 'belum_bayar';

        // Tambahkan status pembayaran Skripsi (tanpa semester)
        $statusSkripsi = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran.jenis_pembayaran', function ($query) {
                $query->where('nama_pembayaran', 'Skripsi');
            })->first()?->status ?? 'belum_bayar';

        return Inertia::render('Mahasiswa/kartu-ujian/index', [
            'semesters' => $semesters,
            'statusPembayaranList' => $statusPembayaranList,
            'statusProposal' => $statusProposal,
            'statusSkripsi' => $statusSkripsi,
            'jenis_mahasiswa' => $mahasiswa->jenis_mahasiswa

        ]);
    }


    public function downloadPdfUTS()
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        $semesterAktif = Semester::latest('tahun_ajaran')
            ->latest('semester')
            ->first();

        $statusUTS = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran', function ($query) use ($semesterAktif) {
                $query->where('semester_id', $semesterAktif->id)
                    ->whereHas('jenis_pembayaran', function ($q) {
                        $q->where('nama_pembayaran', 'UTS');
                    });
            })->first()?->status ?? 'Belum Lunas';

        if ($statusUTS !== 'Lunas') {
            return redirect()->back()->with('error', 'Pembayaran UTS belum lunas.');
        }

        $pdf = Pdf::loadView('pdf.kartu-uts', [
            'mahasiswa' => $mahasiswa,
            'semester' => $semesterAktif,
        ]);

        return $pdf->download('kartu-uts.pdf');
    }

    public function cetak($semester_id, $tipe)
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        // Validasi tipe ujian
        if (!in_array($tipe, ['UTS', 'UAS'])) {
            abort(404, 'Tipe ujian tidak valid.');
        }

        $semester = Semester::findOrFail($semester_id);

        // Cek apakah foto tersedia
        if (is_null($mahasiswa->foto) || $mahasiswa->foto === '') {
            return back()->with('error', 'Silakan unggah foto terlebih dahulu sebelum mencetak kartu ujian.');
        }

        if ($mahasiswa->jenis_mahasiswa === 'beasiswa') {
            $pdf = Pdf::loadView("kartu-ujian", [
                'mahasiswa' => $mahasiswa,
                'semester' => $semester,
                'tipe' => $tipe
            ])->setPaper([0, 0, 297.64, 419.53], 'landscape');

            return $pdf->stream("kartu-$tipe-semester-$semester->id.pdf");
        }


        // Ambil pembayaran berdasarkan semester
        $pembayaran = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                $query->where('semester_id', $semester->id);
            })
            ->with(['detail_jenis_pembayaran.jenis_pembayaran'])
            ->get();



        // Ambil status pembayaran
        // $statusSPP = $pembayaran->firstWhere('detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran', 'SPP');
        // $statusHER = $pembayaran->firstWhere('detail_jenis_pembayaran.jenis_pembayaran.nama_pembayaran', 'HER');

        // Validasi berdasarkan tipe ujian
        if ($tipe === 'UTS') {
            $spp = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'SPP');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();

            $her = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'HER');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();
            $sema = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'SEMA');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();

            // dd([
            //     'spp' => $spp,
            //     'spp_jumlah' => $spp?->jumlah,
            //     'spp_total_dibayar' => $spp?->total_dibayar(),
            //     'her' => $her,
            //     'her_status' => $her?->status,
            // ]);


            $sppValid = false;

            if ($spp && $spp->jumlah > 0) {
                $dibayar = $spp->total_dibayar();
                $persentase = ($dibayar / $spp->jumlah) * 100;
                $sppValid = $persentase >= 50;
            }

            $herValid = $her && $her->status === 'lunas';
            $semaValid = $sema && $sema->status === 'lunas';

            if (!$sppValid || !$herValid || !$semaValid) {
                return redirect()->back()->with('error', 'Untuk mencetak kartu UTS, pembayaran SPP minimal 50%, SEMA dan HER harus lunas pada semester ini.');
            }
        } elseif ($tipe === 'UAS') {
            $spp = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'SPP');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();

            $her = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'HER');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();
            $sema = $mahasiswa->tanggungan_pembayaran()
                ->whereHas('detail_jenis_pembayaran', function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                        ->whereHas('jenis_pembayaran', function ($q) {
                            $q->where('nama_pembayaran', 'SEMA');
                        });
                })
                ->with('detail_jenis_pembayaran.jenis_pembayaran')
                ->first();


            $herValid = $her && $her->status === 'lunas';
            $semaValid = $sema && $sema->status === 'lunas';
            $sppValid = $spp && $spp->status === 'lunas';

            if (!$sppValid || !$herValid || !$semaValid) {
                return back()->with('error', 'Untuk mencetak kartu UAS, pembayaran SPP, SEMA dan HER harus lunas pada semester ini.');
            }
        }



        // Generate PDF
        $pdf = Pdf::loadView("kartu-ujian", [
            'mahasiswa' => $mahasiswa,
            'semester' => $semester,
            'tipe' => $tipe
        ])->setPaper([0, 0, 297.64, 419.53], 'landscape');

        return $pdf->stream("kartu-$tipe-semester-$semester->id.pdf");
    }


    public function cetakProposal()
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        // Jika mahasiswa adalah beasiswa penuh, langsung izinkan cetak
        if ($mahasiswa->jenis_mahasiswa === 'beasiswa') {
            $pdf = Pdf::loadView('kartu-ujian-proposal', [
                'mahasiswa' => $mahasiswa,
                'tipe' => 'Proposal',
            ])->setPaper([0, 0, 297.64, 419.53], 'landscape');

            return $pdf->stream('kartu-proposal.pdf');
        }

        // Jika bukan beasiswa, periksa status pembayaran
        $status = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran.jenis_pembayaran', function ($q) {
                $q->where('nama_pembayaran', 'Proposal');
            })->first()?->status ?? 'belum_lunas';

        if ($status !== 'lunas') {
            return back()->with('error', 'Pembayaran Proposal belum lunas.');
        }

        $pdf = Pdf::loadView('kartu-ujian-proposal', [
            'mahasiswa' => $mahasiswa,
            'tipe' => 'Proposal',
        ])->setPaper([0, 0, 297.64, 419.53], 'landscape');

        return $pdf->stream('kartu-proposal.pdf');
    }


    public function cetakSkripsi()
    {
        $mahasiswa = Auth::guard('mahasiswa')->user();

        $status = $mahasiswa->tanggungan_pembayaran()
            ->whereHas('detail_jenis_pembayaran.jenis_pembayaran', fn($q) => $q->where('nama_pembayaran', 'Skripsi'))
            ->first()?->status ?? 'belum_lunas';

        if ($status !== 'lunas') {
            return back()->with('error', 'Pembayaran Skripsi belum lunas.');
        }

        $pdf = Pdf::loadView('kartu-ujian-skripsi', [
            'mahasiswa' => $mahasiswa,
            'tipe' => 'Skripsi',
        ])->setPaper([0, 0, 297.64, 419.53], 'landscape');

        return $pdf->stream('kartu-skripsi.pdf');
    }

    public function validasi($id, $tipe, $semesterId = null)
    {
        $mahasiswa = Mahasiswa::with('tanggungan_pembayaran.detail_jenis_pembayaran.jenis_pembayaran')->findOrFail($id);

        $statusPembayaran = 'belum_lunas';
        $semester = null;

        if (in_array(strtolower($tipe), ['uts', 'uas']) && $semesterId) {
            $semester = Semester::findOrFail($semesterId);

            $statusPembayaran = $mahasiswa->tanggungan_pembayaran->first(function ($tp) use ($tipe, $semesterId) {
                return strtolower($tp->detail_jenis_pembayaran->jenis_pembayaran->nama_pembayaran) === strtolower($tipe)
                    && $tp->detail_jenis_pembayaran->semester_id == $semesterId;
            })?->status ?? 'belum_lunas';
        } elseif (in_array(strtolower($tipe), ['skripsi', 'proposal'])) {
            $statusPembayaran = $mahasiswa->tanggungan_pembayaran->first(function ($tp) use ($tipe) {
                return strtolower($tp->detail_jenis_pembayaran->jenis_pembayaran->nama_pembayaran) === strtolower($tipe);
            })?->status ?? 'belum_lunas';
        } else {
            abort(404, 'Data validasi tidak ditemukan.');
        }

        return view('kartu-ujian-validasi', compact('mahasiswa', 'statusPembayaran', 'tipe', 'semester'));
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
