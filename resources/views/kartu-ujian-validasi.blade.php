<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validasi Kartu {{ ucfirst($tipe) }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 2em;
            background: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 1.5em;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .status {
            font-weight: bold;
            color: {{ in_array($statusPembayaran, ['lunas', 'lunas (beasiswa)']) ? 'green' : 'red' }};
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Validasi Kartu Ujian {{ ucfirst($tipe) }}</h2>
        <p>Nama: <strong>{{ $mahasiswa->name }}</strong></p>
        <p>NIM: <strong>{{ $mahasiswa->nim }}</strong></p>

        @if ($semester)
            <p>Semester: <strong>{{ $semester->semester }} ({{ $semester->tahun_ajaran }})</strong></p>
        @endif

        <p>Status Pembayaran <strong> {{ ucfirst($tipe) }}</strong> :
            <span
                class="{{ in_array($statusPembayaran, ['lunas', 'lunas (beasiswa)']) ? 'text-green-500 font-bold' : 'text-red-500 font-bold' }}">
                {{ strtoupper($statusPembayaran) }}
            </span>
        </p>
    </div>
</body>

</html>
