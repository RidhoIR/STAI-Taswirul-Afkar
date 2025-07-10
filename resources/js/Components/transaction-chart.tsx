import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { formatRupiah } from "@/lib/formatters";
import { formatRupiah } from "@/lib/utils";

interface TransactionChartProps {
    pemasukan: number;
    pengeluaran: number;
}


export function TransactionChart({ pemasukan, pengeluaran }: TransactionChartProps) {
    const data = [
        {
            name: "Pemasukan",
            value: pemasukan,
            fill: "#10b981"
        },
        {
            name: "Pengeluaran",
            value: pengeluaran,
            fill: "#f43f5e"
        }
    ];

    const FormatRupiah = (value: string) => {
        const numberString = value.replace(/[^,\d]/g, '').toString(); // Hapus semua karakter non-digit
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        
        return rupiah ? `${rupiah}` : ''; // Tambahkan awalan Rp.
    };

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 15, right: 40, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tickFormatter={(value) => value.toLocaleString("id-ID")}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    formatter={(value) => formatRupiah(Number(value))}
                    labelStyle={{ color: "#111", fontWeight: "bold" }}
                    contentStyle={{
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                />
                <Legend
                    wrapperStyle={{ paddingTop: "15px" }}
                />
                <Bar
                    dataKey="value"
                    name="Jumlah"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
