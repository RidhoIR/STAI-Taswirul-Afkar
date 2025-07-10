import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"

export default function PembayaranBar({ title, data }: { title: string, data: any }) {
    const chartData = [
        { status: "Lunas", value: data.lunas, color: "var(--chart-lunas)" },
        { status: "Belum Lunas", value: data.belum_lunas, color: "var(--chart-belum-lunas)" },
        { status: "Belum Bayar", value: data.belum_bayar, color: "var(--chart-belum-bayar)" },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                        <XAxis dataKey="status" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-lunas)" }}
                        ></span>
                        <span>Lunas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-belum-lunas)" }}
                        ></span>
                        <span>Belum Lunas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-belum-bayar)" }}
                        ></span>
                        <span>Belum Bayar</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
