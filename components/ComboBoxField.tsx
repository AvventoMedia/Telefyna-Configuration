"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


// ComboBox Component
const ComboBox = React.forwardRef<HTMLButtonElement, { options: any[], value: string, onChange: (value: string) => void, placeholder?: string }>(
    ({ options, value, onChange, placeholder = "Select an option" }: { options: any[], value: string, onChange: (value: string) => void, placeholder?: string }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between shad-input-label"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-white opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 rounded-lg border shadow-md">
                <Command className="w-full">
                    <CommandInput
                        className="shad-input-label"
                        placeholder={`Search ${placeholder.toLowerCase()}...`} />
                    <CommandList className="w-full">
                        <CommandEmpty className="p-4 shad-select-content shad-input-label">No option found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                    className="shad-select-content text-white w-full"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
    }
);

export default ComboBox;
