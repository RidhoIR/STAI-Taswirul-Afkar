<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Kartu Ujian Skripsi</title>
    <style>
        @page {
            margin-top: 5px;
            margin-left: 5px;
            margin-right: 5px;
            margin-bottom: 0;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #111;
        }

        .container {
            width: 100%;
        }

        .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            /* color: #003366; */
            margin-top: 10px;
            margin-bottom: 5px
        }

        .subtitle {
            text-align: center;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .line {
            border-top: 2px solid #003366;
            margin: 10px 0 20px;
        }

        /* .box {
            border: 2px dashed #888;
            padding: 10px;
            border-radius: 8px;
            background: #fefefe;
        } */

        .main-table {
            width: 100%;
            border-collapse: collapse;
            /* margin-top: 5px; */
        }

        .info-cell {
            padding-left: 10px;
            padding-right: 10px;
            vertical-align: top;
            width: 75%;
        }

        .photo-cell {
            /* border: 1px solid #000; */
            width: 25%;
            vertical-align: top;
            text-align: center;
            padding-top: 10px;
        }

        .student-photo {
            width: 90px;
            height: 110px;
            object-fit: cover;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f0f0f0;
        }

        .photo-placeholder {
            width: 90px;
            height: 110px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f0f0f0;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            color: #666;
            font-size: 9pt;
        }

        .info-table {
            width: 100%;
            margin-bottom: 15px;
        }

        .info-table td {
            padding: 3px 5px;
            vertical-align: top;
        }

        .info-table td:first-child {
            width: 120px;
        }

        .footer {
            text-align: center;
            font-size: 10pt;
        }

        .signature {
            height: 40px;
        }

        .footer-note {
            font-style: italic;
            font-size: 7pt;
            text-align: center;
            margin-top: 20px;
            color: #666;
        }

        .header-img {
            width: 100%;
            height: 100px;
            /* border: solid 1px #333; */
            /* margin-bottom: 5px; */
        }
    </style>
</head>

<body>
    <div class="box">
        <div class="container">
            <img src="{{ public_path('images/kop_staita_copy.png') }}" class="header-img" alt="Kop Surat">
            <div class="title">KARTU UJIAN SKRIPSI</div>
            <table class="main-table">
                <tr>
                    <td class="info-cell">
                        <table class="info-table">
                            <tr>
                                <td>Nama</td>
                                <td>: {{ $mahasiswa->name }}</td>
                            </tr>
                            <tr>
                                <td>NIM</td>
                                <td>: {{ $mahasiswa->nim }}</td>
                            </tr>
                            <tr>
                                <td>Program Studi</td>
                                <td>: Pendidikan Agama Islam</td>
                            </tr>
                            <tr>
                                <td>Tahun Akademik</td>
                                <td>: {{ now()->year }}/{{ now()->addYear()->year }}</td>
                            </tr>
                        </table>

                        <div class="footer">
                            Mengetahui,<br>
                            <div class="signature"></div>
                            <strong>Petugas Akademik</strong>
                        </div>
                    </td>
                    <td class="photo-cell">
                        @if ($mahasiswa->foto)
                            <img src="{{ public_path('storage/' . $mahasiswa->foto) }}" alt="Foto Mahasiswa"
                                class="student-photo">
                        @else
                            <div class="photo-placeholder">
                                Foto<br>Mahasiswa<br>3x4
                            </div>
                        @endif
                        <div style="margin-top: 10px;">
                            @php
                                // Buat URL QR Code secara manual
                                $url = route('kartu.validasi', [
                                    'id' => $mahasiswa->id,
                                    'tipe' => 'Skripsi',
                                ]);

                                // Generate SVG QR-nya
                                $svg = QrCode::format('svg')->size(40)->generate($url);

                                // Encode ke base64 agar bisa di-embed
                                $qrCode = base64_encode($svg);
                            @endphp

                            <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code" width="60">
                            <div style="font-size: 7pt; margin-top: 4px;">Scan untuk verifikasi</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="footer-note">
            Kartu ini wajib dibawa saat ujian skripsi berlangsung.
        </div>
    </div>
</body>

</html>
