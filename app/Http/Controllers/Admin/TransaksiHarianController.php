<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TransaksiHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransaksiHarianController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function indexPengeluaran()
    {
        $transaksiHarians = TransaksiHarian::with('user')
            ->where('jenis', 'pengeluaran')
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($item) {
                $item->tanggal = \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y');
                return $item;
            });

        return inertia('Admin/Bendahara/transaksi-harian/pengeluaran/index', [
            'transaksiHarians' => $transaksiHarians
        ]);
    }

    public function indexPemasukan()
    {
        $transaksiHarians = TransaksiHarian::with('user')
            ->where('jenis', 'pemasukan')
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($item) {
                $item->tanggal = \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y');
                return $item;
            });

        return inertia('Admin/Bendahara/transaksi-harian/pemasukan/index', [
            'transaksiHarians' => $transaksiHarians
        ]);
    }

    public function storePemasukan(Request $request)
    {
        try {
            $request->validate([
                'deskripsi' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'jumlah' => 'required|integer|min:1',
            ]);

            TransaksiHarian::create([
                'user_id' => Auth::id(),
                'deskripsi' => $request->deskripsi,
                'tanggal' => $request->tanggal,
                'jumlah' => $request->jumlah,
                'jenis' => 'pemasukan',
            ]);

            return redirect()->back()->with('success', 'Pemasukan berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function storePengeluaran(Request $request)
    {
        try {
            $request->validate([
                'deskripsi' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'jumlah' => 'required|integer|min:1',
            ]);

            TransaksiHarian::create([
                'user_id' => Auth::id(),
                'deskripsi' => $request->deskripsi,
                'tanggal' => $request->tanggal,
                'jumlah' => $request->jumlah,
                'jenis' => 'pengeluaran',
            ]);

            return redirect()->back()->with('success', 'Pengeluaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'deskripsi' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'jumlah' => 'required|integer|min:1',
                // 'jenis' => 'required|in:pemasukan,pengeluaran',
            ]);

            $transaksi = TransaksiHarian::findOrFail($id);

            $transaksi->update([
                'deskripsi' => $request->deskripsi,
                'tanggal' => $request->tanggal,
                'jumlah' => $request->jumlah,
                // 'jenis' => $request->jenis,
            ]);

            return redirect()->back()->with('success', 'Data transaksi berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
        $transaksi = TransaksiHarian::findOrFail($id);
        $transaksi->delete();

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ': ' . $e->getMessage());
        }
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
}
