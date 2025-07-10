import { Calendar } from "@/Components/ui/calendar"
import { useState } from "react"

export function YearOnlyPicker({ year, setYear }: { year: number; setYear: (y: number) => void }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(year, 0, 1))

    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
                if (date) {
                    setSelectedDate(date)
                    setYear(date.getFullYear())
                }
            }}
            fromYear={2000}
            toYear={new Date().getFullYear()}
            captionLayout="dropdown"
            className="rounded-md border"
        />
    )
}
