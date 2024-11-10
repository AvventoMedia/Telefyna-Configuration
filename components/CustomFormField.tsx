"use client"

import React from 'react'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control} from "react-hook-form";
import {FormFieldType} from "@/components/forms/InitialForm";
import Image from "next/image";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import MultipleSelector from "@/components/ui/multipleselector";
import {Option} from "@/components/forms/DeletePlaylistScheduleForm";

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    onValueChange?: (value: any) => void
    multiSelectOptions?: Option[],
    placeholder?: string,
    inputType?: string,
    description?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTime?: boolean,
    setSelectedToDelete?: React.Dispatch<React.SetStateAction<string[]>>;
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}


const RenderField = ({field, props}: {field: any, props: CustomProps}) => {
    const {
        fieldType,
        name,
        label,
        iconAlt,
        iconSrc,
        placeholder,
        inputType,
        showTime,
        dateFormat,
        renderSkeleton,
        multiSelectOptions,
        disabled } = props
    switch (fieldType) {
        case FormFieldType.INPUT: {
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className="ml-2"
                        />
                    )}
                    <FormControl className="w-full">
                        <Input
                            {...field}
                            type={inputType || 'text'}
                            value={field.value !== undefined ? field.value : ''}
                            placeholder={placeholder}
                            className="shad-input border-0 text-white"/>
                    </FormControl>
                </div>
            )
        }
        case FormFieldType.TEXTAREA: {
            return (
                <FormControl className="w-full">
                    <Textarea
                        {...field}
                        placeholder={placeholder}
                        className="shad-textArea text-white"
                        disabled={disabled}/>
                </FormControl>
            )
        }
        case FormFieldType.DATE_PICKER: {
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt='calender'
                        className="ml-2"
                    />
                    <FormControl className="w-full">
                        <DatePicker
                            {...field}
                            placeholderText="Select date"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? 'dd/MM/yyyy'}
                            showDateSelect={showTime ?? false}
                            timeInputLabel="Time:"
                            className="text-white"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            )
        }
        case FormFieldType.SELECT: {
            return (
                <FormControl>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            props.onValueChange && props.onValueChange(value); // Call parent's handler if passed
                        }}
                        defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger className="shad-select-trigger shad-input-label">
                              <SelectValue placeholder={placeholder}/>
                          </SelectTrigger>
                      </FormControl>
                        <SelectContent className="shad-select-content text-white">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        }
        case FormFieldType.MULTI_SELECT: {
            return (
                <FormControl>
                    <MultipleSelector
                        {...field}
                        defaultOptions={multiSelectOptions}
                        hidePlaceholderWhenSelected
                        placeholder={placeholder}
                        emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                no results found.
                            </p>
                        }
                    />
                </FormControl>
            )
        }
        case FormFieldType.CHECKBOX: {
            return (
                <FormControl>
                    <div className="flex items-center gap-4 radio-group">
                        <Checkbox id={name}
                                  className="text-white"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                        />
                        <Label htmlFor={name} className="checkbox-label">{label}</Label>
                    </div>
                </FormControl>
            )
        }
        case FormFieldType.SKELETON: {
            return renderSkeleton ? renderSkeleton(field) : <></>
        }
        default: {
            break;
        }
    }
}
const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, name, label, description} = props
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className="text-white">{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props}/>
                    {description && (
                        <FormDescription className="text-dark-700">{description}</FormDescription>
                    )}
                    <FormMessage className="shad-error"/>
                </FormItem>
            )}
        />
    )
}
export default CustomFormField
