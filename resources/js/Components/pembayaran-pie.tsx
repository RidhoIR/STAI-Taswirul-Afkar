import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart"

export default function PembayaranPie({ title, data }: { title: string, data: any }) {
    const chartData = [
        { status: "Lunas", value: data.lunas, fill: "var(--chart-lunas)" },
        { status: "Belum Lunas", value: data.belum_lunas, fill: "var(--chart-belum-lunas)" },
        { status: "Belum Bayar", value: data.belum_bayar, fill: "var(--chart-belum-bayar)" },
    ]

    const chartConfig = {
        value: {
            label: "Jumlah Mahasiswa",
        },
        Lunas: {
            label: "Lunas",
            color: "var(--chart-lunas)",
        },
        BelumLunas: {
            label: "Belum Lunas",
            color: "var(--chart-belum-lunas)",
        },
        BelumBayar: {
            label: "Belum Bayar",
            color: "var(--chart-belum-bayar)",
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[180px] pb-0"
                >
                    <PieChart width={200} height={200}>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="status"
                            label
                            outerRadius={60} // <== Ukuran radius pie
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-lunas)' }}></span>
                        <span>Lunas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-belum-lunas)' }}></span>
                        <span>Belum Lunas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-belum-bayar)' }}></span>
                        <span>Belum Bayar</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
