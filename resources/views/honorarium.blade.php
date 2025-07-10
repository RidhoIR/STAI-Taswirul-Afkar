<!DOCTYPE html>
<html>

<head>
    <title>Honorarium Periode {{ $periode }}</title>
    <style>
        @page {
            margin-top: 0;
        }

        body {
            font-family: sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #eee;
        }

        .ttd-section {
            width: 100%;
            margin-top: 60px;
            text-align: center;
            border: none;
        }

        .ttd-section td {
            border: none;
            padding-top: 50px;
        }

        .ttd-title {
            font-weight: bold;
            margin-bottom: 60px;
        }
    </style>
</head>

<body>

    <img src="{{ public_path('images/kop_staita.png') }}" alt=""
        style="width: 100%; display: block; margin: 0; padding: 0;">
    <h2 style="text-align: center;">Honorarium Periode {{ \Carbon\Carbon::parse($periode)->translatedFormat('F Y') }}
    </h2>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jumlah MK</th>
                <th>Honor MK</th>
                <th>Jabatan</th>
                <th>Lain-lain</th>
                <th>Jumlah</th>
                <th>TTD</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($honorariums as $honor)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $honor->name }}</td>
                    <td>{{ $honor->jumlah_mk }}</td>
                    <td>
                        Rp
                        @php
                            $jumlahHonor =
                                $honor->jumlah_mk > 0 ? $honor->jumlah_mk * $honor->honor_mk : $honor->honor_mk;
                        @endphp
                        {{ number_format($jumlahHonor, 0, ',', '.') }}
                    </td>
                    <td>
                        @if ($honor->jabatan)
                            Rp {{ number_format($honor->jabatan->honor, 0, ',', '.') }}
                        @endif
                    </td>
                    <td>Rp {{ number_format($honor->lain_lain, 0, ',', '.') ?? '' }}</td>
                    <td>Rp {{ number_format($honor->jumlah, 0, ',', '.') }}</td>
                    <td>_____________</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="ttd-section">
        <tr>
            <td style="width: 33%; text-align: center;">Mengetahui,<br>Wakil Ketua 1</td>
            <td style="width: 33%;">&nbsp;</td>
            <td style="width: 33%; text-align: center;">Bagian Keuangan</td>
        </tr>
        <tr>
            <td style="text-align: center;">(.....................................)</td>
            <td></td>
            <td style="text-align: center;">(.....................................)</td>
        </tr>
        <tr>
            <td style="width: 33%;">&nbsp;</td>
            <td style="width: 33%; text-align: center;">Mengetahui,<br>Ketua STAI Taswirul Afkar</td>
            <td style="width: 33%;">&nbsp;</td>

        </tr>
        <tr>
            <td></td>
            <td style="text-align: center;">(.....................................)</td>
            <td></td>
        </tr>
    </table>

</body>

</html>
