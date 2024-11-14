import { Checkbox } from "@/components/ui/checkbox";
import {Control, Controller} from "react-hook-form";

const items = [
    { id: "checkbox-18-c1", value: "c1", label: "Sun", fullLabel: "Sunday"},
    { id: "checkbox-18-c2", value: "c2", label: "Mon", fullLabel: "Monday"},
    { id: "checkbox-18-c3", value: "c3", label: "Tue", fullLabel: "Tuesday"},
    { id: "checkbox-18-c4", value: "c4", label: "Wed", fullLabel: "Wednesday" },
    { id: "checkbox-18-c5", value: "c5", label: "Thu", fullLabel: "Thursday"},
    { id: "checkbox-18-c6", value: "c6", label: "Fri", fullLabel: "Friday"},
    { id: "checkbox-18-c7", value: "c7", label: "Sat", fullLabel: "Saturday" },
];

const DaysOfTheWeek = ({ control, name }: { control: any; name: string }) => {
    return (
        <fieldset className="space-y-4">
            <div className="flex gap-1.5">
                {items.map((item) => (
                    <label
                        key={item.id}
                        className="relative flex size-11 text-white cursor-pointer flex-col items-center justify-center gap-3 rounded-full border border-input text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-disabled]]:cursor-not-allowed has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-green-700 has-[[data-state=checked]]:border-green-700 has-[[data-disabled]]:opacity-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
                    >
                        <Controller
                            name={`${name}[${item.value}]`} // Dynamically assign field name based on checkbox value
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id={item.id}
                                    value={item.fullLabel}
                                    checked={field.value}
                                    onChange={(e) => field.onChange((e.target as HTMLInputElement).checked)}
                                    className="sr-only after:absolute after:inset-0"
                                />
                            )}
                        />
                        <span aria-hidden="true" className="text-sm font-medium">
                            {item.label}
                        </span>
                        <span className="sr-only">{item.fullLabel}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

export default DaysOfTheWeek;