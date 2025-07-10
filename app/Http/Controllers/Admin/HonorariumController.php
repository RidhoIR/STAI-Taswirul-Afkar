<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Honorarium;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;


class HonorariumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua honorarium
        $honorariums = Honorarium::with('jabatan')->get();

        return Inertia::render('Admin/Bendahara/Honorarium/index', ['honorariums' => $honorariums]);
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
            $request->validate([
                'periode' => 'required|date',
                'name' => 'required|string',
                'jabatan_id' => 'nullable|exists:jabatans,id',
                'jumlah_mk' => 'nullable|integer',
                'honor_mk' => 'required|numeric',
                'lain_lain' => 'nullable|numeric',
            ]);

            $periode = Carbon::parse($request->periode)->startOfMonth();

            // Cek apakah honorarium untuk orang dan bulan ini sudah ada
            $existing = Honorarium::where('name', $request->name)
                ->whereDate('periode', $periode)
                ->first();
            // dd($request->name);


            if ($existing) {
                return redirect()->back()->with('error', 'Honorarium untuk orang ini dan periode ini sudah ada.');
            }
            // dd($existing);


            // Ambil data jabatan untuk honor
            if ($request->jabatan_id) {
                $jabatan = Jabatan::findOrFail($request->jabatan_id);
                $honor_jabatan = $jabatan->honor;
            }
            // dd($jabatan);

            // Hitung jumlah_honor_mk
            $jumlah_mk = $request->jumlah_mk ?? 0;
            $honor_mk = $request->honor_mk ?? 0;
            $jumlah_honor_mk = ($jumlah_mk > 0) ? ($jumlah_mk * $honor_mk) : $honor_mk;

            $jumlah = $jumlah_honor_mk + ($honor_jabatan ?? 0) + ($request->lain_lain ?? 0);

            Honorarium::create([
                'jabatan_id' => $request->jabatan_id,
                'name' => $request->name,
                'periode' => $periode,
                'jumlah_mk' => $jumlah_mk,
                'honor_mk' => $honor_mk,
                'lain_lain' => $request->lain_lain ?? null,
                'jumlah' => $jumlah,
            ]);

            return redirect()->route('admin.bendahara.honorarium.index')
                ->with('success', 'Honorarium berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $honorarium = Honorarium::findOrFail($id);

            $periode = Carbon::parse($request->periode)->startOfMonth();


            // Ambil data jabatan untuk honor
            if ($request->jabatan_id) {
                $jabatan = Jabatan::findOrFail($request->jabatan_id);
                $honor_jabatan = $jabatan->honor;
            }

            // Hitung jumlah_honor_mk
            $jumlah_mk = $request->jumlah_mk ?? 0;
            $honor_mk = $request->honor_mk ?? 0;
            $jumlah_honor_mk = ($jumlah_mk > 0) ? ($jumlah_mk * $honor_mk) : $honor_mk;

            $jumlah = $jumlah_honor_mk + ($honor_jabatan ?? 0) + ($request->lain_lain ?? 0);

            $honorarium->update([
                'jabatan_id' => $request->jabatan_id,
                'name' => $request->name,
                'periode' => $periode,
                'jumlah_mk' => $jumlah_mk,
                'honor_mk' => $honor_mk,
                'lain_lain' => $request->lain_lain ?? null,
                'jumlah' => $jumlah,
            ]);

            return redirect()->route('admin.bendahara.honorarium.index')
                ->with('success', 'Honorarium berhasil diupdate.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $honorarium = Honorarium::findOrFail($id);
            $honorarium->delete();

            return redirect()->route('admin.bendahara.honorarium.index')
                ->with('success', 'Honorarium berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function exportPdf(Request $request)
    {
        Carbon::setLocale('id');
        $periode = $request->query('periode'); // format: Y-m

        $carbonPeriode = Carbon::createFromFormat('Y-m', $periode);

        $honorariums = Honorarium::whereMonth('periode', $carbonPeriode->month)
            ->whereYear('periode', $carbonPeriode->year)
            ->get();

        if ($honorariums->isEmpty()) {
            return 'Data tidak ditemukan untuk periode: ' . $periode;
        }

        $pdf = Pdf::loadView('honorarium', compact('honorariums', 'periode',));
        return $pdf->stream("Honorarium-$periode.pdf");
    }

    public function exportSlip(Request $request, $id)
    {
        Carbon::setLocale('id');
        // $id = $request->query('id');
        // $periode = $request->query('periode');

        $honor = Honorarium::with('jabatan')->find($id);

        // Validasi: jika ingin pastikan periode cocok
        // if ($honor->periode !== $periode) {
        //     abort(404, 'Periode tidak cocok');
        // }
        $jumlah_honor_mk = ($honor->jumlah_mk > 0) ? ($honor->jumlah_mk * $honor->honor_mk) : $honor->honor_mk;
        $pdf = Pdf::loadView('slip_gaji', compact('honor', 'jumlah_honor_mk'))->setPaper('a5', 'portrait');
        return $pdf->stream("Slip-Gaji-{$honor->name}-{$honor->periode}.pdf");
    }

    public function copyFromPreviousMonth(Request $request)
    {
        $request->validate([
            'periode' => 'required|date', // Format tanggal biasa: Y-m-d
        ]);

        $periodeSekarang = Carbon::parse($request->periode);
        $periodeSebelumnya = $periodeSekarang->copy()->subMonth();

        // Cek jika sudah ada honorarium untuk bulan dan tahun yang sama
        $existing = Honorarium::whereMonth('periode', $periodeSekarang->month)
            ->whereYear('periode', $periodeSekarang->year)
            ->count();

        if ($existing > 0) {
            return back()->with('error', 'Honorarium untuk bulan ini sudah ada. Tidak bisa disalin otomatis.');
        }

        // Ambil honorarium dari bulan sebelumnya
        $honorSebelumnya = Honorarium::whereMonth('periode', $periodeSebelumnya->month)
            ->whereYear('periode', $periodeSebelumnya->year)
            ->get();

        if ($honorSebelumnya->isEmpty()) {
            return back()->with('error', 'Tidak ada data honorarium di bulan sebelumnya.');
        }

        foreach ($honorSebelumnya as $honor) {
            Honorarium::create([
                'name' => $honor->name,
                'jumlah_mk' => $honor->jumlah_mk,
                'honor_mk' => $honor->honor_mk,
                'periode' => $periodeSekarang->toDateString(), // disimpan dalam format Y-m-d
                'jabatan' => $honor->jabatan,
                'lain_lain' => $honor->lain_lain,
                'jumlah' => $honor->jumlah,
            ]);
        }

        return back()->with('success', 'Data honor bulan sebelumnya berhasil disalin ke bulan ini.');
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


    /**
     * Remove the specified resource from storage.
     */
}
