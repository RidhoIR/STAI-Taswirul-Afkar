<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        h2,
        h3 {
            text-align: center;
            margin: 2px 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
        }

        .no-border td {
            border: none;
        }

        .judul-sub {
            font-weight: bold;
            text-transform: uppercase;
        }
    </style>
</head>

<body>

    <h2>LAPORAN KEUANGAN BULANAN</h2>
    <h3>STAI TASWIRUL AFKAR SURABAYA</h3>
    <h3>BULAN {{ \Carbon\Carbon::parse($laporan->periode_awal)->translatedFormat('F Y') }}</h3>

    <table width="100%">
        <tr>
            <th colspan="3" align="center">PEMASUKAN</th>
            <th colspan="3" align="center">PENGELUARAN</th>
        </tr>
        <tr>
            <th style="width: 5%;">NO</th>
            <th style="width: 55%;">URAIAN</th>
            <th style="width: 20%;">JUMLAH</th>

            <th style="width: 5%;">NO</th>
            <th style="width: 55%;">URAIAN</th>
            <th style="width: 20%;">JUMLAH</th>
        </tr>
        @php
            // Ubah hasil dari jenisPembayaranTotals jadi objek mirip DetailLaporan
            foreach ($jenisPembayaranTotals as $item) {
                $pemasukan->push(
                    (object) [
                        'sumber' => $item->jenis,
                        'jumlah' => $item->total,
                    ],
                );
            }

            // Re-index ulang setelah push
            $pemasukan = $pemasukan->values();

            // Hitung jumlah baris terbanyak
            $rows = max(count($pemasukan), count($pengeluaran));
        @endphp

        @php
            $rows = max(count($pemasukan), count($pengeluaran));
        @endphp

        @for ($i = 0; $i < $rows; $i++)
            <tr>
                {{-- Pemasukan --}}
                <td>{{ $i + 1 }}</td>
                <td>{!! $pemasukan[$i]->sumber ?? '' !!}</td>
                <td align="right">
                    {{ isset($pemasukan[$i]) ? number_format($pemasukan[$i]->jumlah, 0, ',', '.') : '' }}
                </td>

                {{-- Pengeluaran --}}
                <td>{{ $i + 1 }}</td>
                <td>{!! $pengeluaran[$i]->sumber ?? '' !!}</td>
                <td align="right">
                    {{ isset($pengeluaran[$i]) ? number_format($pengeluaran[$i]->jumlah, 0, ',', '.') : '' }}
                </td>
            </tr>
        @endfor
    </table>

    <br>
    <h4 style="margin-top: 20px;">Ringkasan Keuangan</h4>
    <table>
        <tbody>
            <tr>
                <td><strong>Saldo Awal</strong></td>
                <td align="right">{{ number_format($laporan->saldo_awal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Total Pemasukan</strong></td>
                <td align="right">{{ number_format($totalPemasukan, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Total Pengeluaran</strong></td>
                <td align="right">{{ number_format($totalPengeluaran, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Saldo Akhir</strong></td>
                <td align="right">{{ number_format($saldoAkhir, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Tambahkan bagian total per sumber honor jika ada --}}
    {{-- @if (!empty($honorTotals))
        <h4 style="margin-top: 20px;">Detail Honor</h4>
        <table>
            <thead>
                <tr>
                    <th>Jenis Honor</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($honorTotals as $jenis => $jumlah)
                    <tr>
                        <td>{{ $jenis }}</td>
                        <td align="right"> {{ number_format($jumlah, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif --}}

</body>

</html>
