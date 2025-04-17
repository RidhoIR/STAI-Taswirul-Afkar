<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Nota Transaksi Pembayaran</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #000;
        }

        .header,
        .footer {
            width: 100%;
            margin-bottom: 20px;
        }

        .header h2 {
            margin: 0;
            color: #0d47a1;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .info-table,
        {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        }

        .detail-table th {
            background-color: #e3f2fd;
        }

        .info-table td {
            padding: 5px;
        }
        .detail-table td,
        .detail-table th {
            border: 1px solid #ddd;
            padding: 6px;
        }



        .signature {
            width: 100%;
            margin-top: 40px;
        }

        .signature td {
            padding-top: 20px;
            text-align: center;
        }

        .status {
            padding: 4px 8px;
            background-color: #c8e6c9;
            color: green;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
        }

        .total-box {
            margin-top: 10px;
        }

        .total-box td {
            padding: 4px 6px;
        }

        .note {
            font-size: 10px;
            margin-top: 30px;
        }
    </style>
</head>

<body>
    <table class="header" style="border-bottom: 2px solid #0d47a1; padding-bottom: 5px">
        <tr>
            <td><img src="{{ public_path('images/logo stai.png') }}" height="40" alt="LOGO"></td>
            <td>
                <h2 style="font-size: 12px">NOTA TRANSAKSI PEMBAYARAN</h2>
                <small>STAI Taswirul Afkar</small>
            </td>
            <td class="right">
                <strong style="color: #0d47a1">No. Nota: {{ $noInvoice }}</strong><br>
                <small>Tanggal: {{ \Carbon\Carbon::parse($tanggalPembayaran)->format('d F Y') }}</small>
            </td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td style="width: 50%">
                Diterima dari:
            </td>
            <td>
                Administrator:
            </td>
        </tr>
        <tr>
            <td>
                <strong>{{ $nama }}</strong>
            </td>
            <td>
                <strong>{{ $admin }}</strong>
            </td>
        </tr>
        <tr>
            <td>
                NIM: {{ $nim }}
            </td>
            <td>
                Jenis Pembayaran: <span style="text-transform: uppercase">{{ $jenisPembayaran }}</span>
            </td>
        </tr>
        <tr>
            <td>
                Semester: {{ $tahun }} {{ $semester }}
            </td>
            <td>
                Status: <span style="color: green; font-weight: bold">LUNAS</span>
            </td>
        </tr>
    </table>

    <table class="detail-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td style="text-transform: capitalize">{{ $deskripsi }}</td>
                <td>Rp {{ number_format($harga, 0, ',', '.') }}</td>
                <td>Rp {{ number_format($harga, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>


    <table class="total-box" style=" width: 50%; margin-left: auto;">
        <tr>
            <td class="right" colspan="4">Subtotal</td>
            <td class="right">: Rp {{ number_format($harga, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="right" colspan="4">Jumlah Pembayaran</td>
            <td class="right">: Rp {{ number_format($jumlah, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td colspan="5" style="border-bottom: 1px solid #0d47a1; padding:0"></td>
        </tr>
        <tr>
            <td class="right" colspan="4"><strong>TOTAL</strong></td>
            <td class="right"><strong style="color: #0d47a1;">: Rp
                    {{ number_format($harga, 0, ',', '.') }}</strong>
            </td>
        </tr>
        <tr style="border: 1px solid #0d47a1">
            <td class="right" colspan="4">Kembali</td>
            <td class="right">: Rp {{ number_format($kembali, 0, ',', '.') }}</td>
        </tr>
    </table>


    <table class="signature">
        <tr>
            <td>Tanda tangan penerima:</td>
            <td>Tanda tangan pembayar:</td>
        </tr>
        <tr>
            <td><br><br><strong>{{ $admin }}</strong></td>
            <td><br><br><strong>{{ $nama }}</strong></td>
        </tr>
    </table>

    <div class="note">
        <p><strong>Catatan:</strong></p>
        <ol>
            <li>Nota ini adalah bukti pembayaran sah.</li>
            <li>Pembayaran yang sudah dilakukan tidak dapat dikembalikan.</li>
            <li>Simpan nota ini sebagai bukti pembayaran.</li>
        </ol>
    </div>
</body>

</html>
