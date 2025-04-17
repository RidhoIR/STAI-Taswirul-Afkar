import { Command, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Mahasiswa } from "@/types";



interface ComboboxMahasiswaProps {
    data: Mahasiswa[];
    value: string;
    onChange: (value: string) => void;
}

const ComboboxMahasiswa: React.FC<ComboboxMahasiswaProps> = ({ data, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const selected = data.find((item) => item.id.toString() === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selected ? selected.name : "Pilih mahasiswa"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Cari mahasiswa..." />
                    <CommandList>
                        {data.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.id.toString()}
                                onSelect={() => {
                                    onChange(item.id.toString());
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        item.id.toString() === value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {item.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ComboboxMahasiswa;
