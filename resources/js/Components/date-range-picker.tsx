import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Calendar as CalendarComponent } from '@/Components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';

interface DateRangePickerProps {
    from?: Date;
    to?: Date;
    onSelect: (from: Date | undefined, to: Date | undefined) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    from,
    to,
    onSelect,
}) => {
    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !from && 'text-muted-foreground'
                        )}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {from ? (
                            to ? (
                                <>
                                    {format(from, 'LLL dd, y')} -{' '}
                                    {format(to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pilih rentang tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={from}
                        selected={{ from, to }}
                        onSelect={(range) => {
                            if (
                                from &&
                                to &&
                                range?.from &&
                                range?.to &&
                                isSameDay(from, range.from) &&
                                isSameDay(to, range.to)
                            ) {
                                onSelect(undefined, undefined); // clear range
                            } else {
                                onSelect(range?.from, range?.to);
                            }
                        }}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};