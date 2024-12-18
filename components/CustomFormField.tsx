"use client"

import React, {useState} from 'react'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control} from "react-hook-form";
import {FormFieldType} from "@/components/forms/InitialForm";
import Image from "next/image";

import "react-datepicker/dist/react-datepicker.css";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label"
import MultipleSelector from "@/components/ui/multipleselector";
import {Option} from "@/components/forms/DeletePlaylistScheduleForm";
import ComboBox from "@/components/ComboBoxField";
import DatePicker from "react-multi-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    value?: any,
    name: string,
    label?: string,
    onValueChange?: (value: any) => void
    onChange?: (value: any) => void
    multiSelectOptions?: Option[],
    badgeClassName?: string,
    selectOptions?: any[],
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
    const [selectedValue, setValue] = useState(field.value);
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
                        className="ml-2 mr-2"
                    />
                    <FormControl>
                        <DatePicker
                            {...field}
                            multiple
                            value={field.value || []}
                            onChange={(date) => {
                                // Update the field value with an array of selected dates
                                console.log("Selected date(s):", date);
                                field.onChange(date);
                            }}
                            sort
                            plugins={[<DatePanel />]}
                            format={dateFormat ?? 'DD-MM-YYYY'}
                            style={{
                                backgroundColor: "transparent",
                                border: "0px solid #444",
                                borderRadius: "1px",
                                padding: "9px",
                            }}
                            inputClass="w-full shad-input-label"
                        />
                    </FormControl>
                </div>
            )
        }
        case FormFieldType.SELECT: {
            return (
                <FormControl>
                    <Select
                        {...field}
                        onValueChange={(value) => {
                            field.onChange(value);
                            props.onValueChange && props.onValueChange(value); // Call parent's handler if passed
                        }}
                        defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger className="shad-select-trigger shad-input-label" ref={field.ref}>
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
                <FormControl className="w-full">
                    <MultipleSelector
                        {...field}
                        options={multiSelectOptions}
                        hidePlaceholderWhenSelected
                        placeholder={placeholder}
                        badgeClassName={props.badgeClassName}
                        onChange={(options) => {
                            field.onChange(options);
                            props.onChange && props.onChange(options);
                        }}
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
        case FormFieldType.COMBO_BOX: {
            return (
                <FormControl className="w-full">
                    <ComboBox
                        {...field}
                        options={props.selectOptions ?? []}
                        value={props.value ?? selectedValue}
                        onChange={(value) => {
                            setValue(value);
                            field.onChange(value);
                            props.onChange && props.onChange(value);
                        }}
                        placeholder={placeholder}
                    />
                </FormControl>
            )
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
