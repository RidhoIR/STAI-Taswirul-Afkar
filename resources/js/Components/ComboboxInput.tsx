import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ComboboxInputProps<T> {
    data: T[];
    value: string;
    onChange: (value: string) => void;
    valueKey: keyof T;
    labelKey: keyof T;
    placeholder?: string;
    className?: string;
}

const ComboboxInput = <T extends object>({
    data,
    value,
    onChange,
    valueKey,
    labelKey,
    placeholder = "Pilih item",
    className = "w-full",
}: ComboboxInputProps<T>) => {
    const [open, setOpen] = useState(false);
    const selected = data.find((item) => String(item[valueKey]) === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("justify-between", className)}
                >
                    {selected ? String(selected[labelKey]) : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("p-0", className)}>
                <Command>
                    <CommandInput placeholder={`Cari...`} />
                    <CommandList>
                        {data.map((item, index) => (
                            <CommandItem
                                key={index}
                                value={String(item[valueKey])}
                                onSelect={() => {
                                    onChange(String(item[valueKey]));
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        String(item[valueKey]) === value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {String(item[labelKey])}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ComboboxInput;
