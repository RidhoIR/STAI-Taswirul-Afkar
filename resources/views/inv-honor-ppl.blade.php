<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice Honorarium PPL/KKN</title>
    <style>
        @page {
            margin: 20px;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header h2 {
            margin: 0;
            font-size: 16px;
        }

        .header h4 {
            margin: 0;
            font-size: 12px;
            font-weight: normal;
        }

        .info-table,
        .task-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .info-table td {
            padding: 4px 6px;
        }

        .task-table th,
        .task-table td {
            border: 1px solid #555;
            padding: 6px;
            text-align: left;
        }

        .task-table th {
            background-color: #f0f0f0;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-style: italic;
            font-size: 11px;
        }

        .signature {
            margin-top: 20px;
            width: 100%;
            text-align: center;

        }

        .signature td {

            text-align: center;
            vertical-align: top;
            height: 100px;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>STAI TASWIRUL AFKAR</h2>
        <h4>Invoice Honorarium PPL/KKN</h4>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Nama</strong></td>
            <td>: {{ $honor->nama }}</td>
        </tr>
        <tr>
            <td><strong>Semester</strong></td>
            <td>: {{ $honor->semester->semester }} {{ $honor->semester->tahun_ajaran }}</td>
        </tr>
        <tr>
            <td><strong>Tanggal</strong></td>
            <td>: {{ \Carbon\Carbon::parse($honor->tanggal)->translatedFormat('d F Y') }}</td>
        </tr>
    </table>

    <h4 style="margin-top: 20px;">Detail Tugas</h4>
    <table class="task-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Jenis Tugas</th>
                <th>Jumlah</th>
                <th>Honor per Tugas</th>
                <th>Total Honor</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach ($honor->tugas as $index => $tugas)
                @php $total += $tugas->honor_total; @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ ucfirst($tugas->jenis_tugas) }}</td>
                    <td>{{ $tugas->jumlah ?? '-' }}</td>
                    <td style="text-align: right">Rp {{ number_format($tugas->honor_per_tugas ?? 0, 0, ',', '.') }}</td>
                    <td style="text-align: right">Rp {{ number_format($tugas->honor_total ?? 0, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Total Honorarium</strong></td>
                <td style="text-align: right"><strong>Rp {{ number_format($total, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>

    <table class="signature">
        <tr>
            <td>
                <p>Bagian Keuangan</p>
                <br><br>
                <p><u>________________________</u></p>
            </td>
        </tr>
    </table>

    <div class="footer">
        Dicetak pada {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }} - Sistem Honorarium STAI TASWIRUL AFKAR
    </div>

</body>

</html>
