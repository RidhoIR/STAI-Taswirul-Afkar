import React from 'react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns'; // Pastikan date-fns sudah terinstal jika menggunakan format tanggal
import { id } from 'date-fns/locale';

interface TransaksiProps {
    transaksiId: number;
    noInvoice: string;
    jumlah: number;
    tanggalPembayaran: string;
    jenisPembayaran: string;
}

const Pdf: React.FC<TransaksiProps> = ({ transaksiId, noInvoice, jumlah, tanggalPembayaran, jenisPembayaran }) => {

    // Fungsi untuk membuat dan menampilkan PDF
    
        const doc = new jsPDF('p', 'mm', 'a5'); // Ukuran kertas A5 (148mm x 210mm)

        // Menentukan margin
        const margin = 10;  // Margin 10mm dari setiap sisi
        const pageWidth = 148; // Lebar kertas A5 dalam mm
        const pageHeight = 210; // Tinggi kertas A5 dalam mm

        // Set Font untuk Judul
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text('Laporan Transaksi Pembayaran', pageWidth / 2, margin + 10, { align: 'center' });

        // Garis Pemisah setelah Judul
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 12, pageWidth - margin, margin + 12); // Garis horizontal

        // Set Font untuk Konten Transaksi
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        // Informasi Transaksi
        doc.text('No. Invoice: ' + noInvoice, margin, margin + 25);
        doc.text('Jenis Pembayaran: ' + jenisPembayaran, margin, margin + 35);
        doc.text('Jumlah Pembayaran: Rp ' + jumlah.toLocaleString(), margin, margin + 45);
        doc.text('Tanggal Pembayaran: ' + format(new Date(tanggalPembayaran), 'dd MMMM yyyy', { locale: id }), margin, margin + 55);

        // Menambahkan Tabel (jika perlu)
        const startY = margin + 65;  // Menyesuaikan Y untuk tabel
        const cellHeight = 8;
        const tableData = [
            ['No. Invoice', noInvoice],
            ['Jenis Pembayaran', jenisPembayaran],
            ['Jumlah Pembayaran', 'Rp ' + jumlah.toLocaleString()],
            ['Tanggal Pembayaran', format(new Date(tanggalPembayaran), 'dd MMMM yyyy', { locale: id })],
        ];

        // Header Tabel
        doc.setFillColor(0, 122, 255); // Warna latar belakang header
        doc.setTextColor(255, 255, 255); // Warna teks header
        doc.rect(margin, startY, 65, cellHeight, 'F');
        doc.rect(margin + 70, startY, 65, cellHeight, 'F');
        doc.text('Deskripsi', margin + 5, startY + 5);
        doc.text('Informasi', margin + 75, startY + 5);

        // Isi Tabel
        let currentY = startY + cellHeight;
        doc.setTextColor(0, 0, 0); // Warna teks isi tabel
        tableData.forEach(row => {
            doc.text(row[0], margin + 5, currentY + 5);
            doc.text(row[1], margin + 75, currentY + 5);
            currentY += cellHeight;
        });

        // Garis Pemisah setelah tabel
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY);

        // Output PDF di tab baru
        doc.output('dataurlnewwindow');
    

    return null; // Tidak perlu tombol disini karena tombolnya akan berada di tabel

};

export default Pdf;
