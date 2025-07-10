<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan Honor Wisuda {{ $tahun }}</title>
    <style>
        @page {
            margin-top: 0;
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 40px;
        }

        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f5f5f5;
        }

        ul {
            margin: 0;
            padding-left: 18px;
        }

        .ttd-section {
            margin-top: 40px;
            width: 100%;
            font-size: 12px;
            border: none;
        }

        .ttd-section td {
            text-align: center;
            vertical-align: top;
            height: 80px;
            border: none
        }

        .header-img {
            width: 100%;
            margin-bottom: 5px;
        }

        h2 {
            text-align: center;
            margin: 5px 0 10px 0;
        }
    </style>
</head>

<body>

    <img src="{{ public_path('images/kop_staita.png') }}" class="header-img" alt="Kop Surat">
    <h2>Honor Wisuda Tahun {{ $tahun }}</h2>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Tugas</th>
                <th>Total Honor</th>
                <th>TTD</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($honorList as $honor)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ \Carbon\Carbon::parse($honor->tanggal)->translatedFormat('d F Y') }}</td>
                    <td style="text-transform: capitalize">{{ $honor->nama }}</td>
                    <td style="text-transform: capitalize">{{ $honor->tugas }}</td>
                    <td>
                        Rp {{ number_format($honor->honor_per_tugas, 0, ',', '.') }}
                    </td>
                    <td>_____________</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Total Keseluruhan</strong></td>
                <td colspan="2">
                    <strong>
                        Rp {{ number_format($honorList->sum('honor_per_tugas'), 0, ',', '.') }}
                    </strong>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="ttd-section">
        <tr>
            <td>Mengetahui,<br><strong>Wakil Ketua I</strong></td>
            <td></td>
            <td>Bagian Keuangan</td>
        </tr>
        <tr>
            <td>(........................................)</td>
            <td></td>
            <td>(........................................)</td>
        </tr>
        <tr>
            <td></td>
            <td>Mengetahui,<br><strong>Ketua STAI Taswirul Afkar</strong></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td>(........................................)</td>
            <td></td>
        </tr>
    </table>

</body>

</html>
