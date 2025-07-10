import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

// Props untuk passing dari parent
export function BarChartKeuangan({ data }: { data: any[] }) {
    const chartConfig = {
        pemasukan: {
            label: "Pemasukan",
            color: "#4ade80",
        },
        pengeluaran: {
            label: "Pengeluaran",
            color: "#f87171",
        },
    } satisfies ChartConfig;

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Pemasukan & Pengeluaran per Bulan</CardTitle>
                <CardDescription>Data berdasarkan tahun terpilih</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="bulan"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="pemasukan" fill="#4ade80" radius={4} />
                        <Bar dataKey="pengeluaran" fill="#f87171" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Tren keuangan tahunan <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Menampilkan data bulanan dari Januari hingga Desember
                </div>
            </CardFooter>
        </Card>
    );
}