"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form, FormControl,
} from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField";
import ExportButton from "@/components/ExportButton";
import React, {useEffect, useRef, useState} from "react";
import {TelefynaFormValidation} from "@/lib/validation";
import FileUploader from "@/components/FileUploader";
import {
    ColorOptions,
    logoTypes,
    ResumeTypes,
    SelectPlaylistTypes,
    SpeedTypes,
    TelefynaFormDefaultValues
} from "@/constants";
import {getConfigJson, modifyConfig} from "@/lib/utils";
import RegularButton from "@/components/RegularButton";
import {SelectItem} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group"
import {RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import LowerthirdTable from "@/components/LowerthirdTable";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    CHECKBOX = 'checkbox',
    SELECT= 'select',
    SKELETON = 'skeleton',
}



const CreatePlaylistForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(SelectPlaylistTypes[1].description);
    const [config, setConfig] = useState<any>(null);


    const form = useForm<z.infer<typeof TelefynaFormValidation>>({
        resolver: zodResolver(TelefynaFormValidation),
        defaultValues: {
            ...TelefynaFormDefaultValues
        },
    })

    function onSubmit(values: z.infer<typeof TelefynaFormValidation>) {
        console.log(values)
    }

    // Get the saved config from localStorage (if it exists)
    useEffect(() => {
        const savedConfig = getConfigJson(); // Use utility function to get config

        if (savedConfig && !config) { // Don't reset if config is already set (from upload)
            form.reset(savedConfig); // Initialize the form with saved data
        }
    }, [config, form]);

    // Watch for changes in form fields and update localStorage
    useEffect(() => {
        const subscription = form.watch((value) => {
            const savedConfig = getConfigJson(); // Get the saved config from localStorage

            // Merge saved config with the current form values
            const updatedConfig = {
                ...savedConfig,
                ...value,
            };

            // Check if the savedConfig and updatedConfig are different
            if (JSON.stringify(savedConfig) !== JSON.stringify(updatedConfig)) {
                modifyConfig(updatedConfig); // Save updated config to localStorage
            }
        });

        return () => {
            // Cleanup the subscription when the component unmounts
            subscription.unsubscribe();
        };
    }, [config, form]);

    // Handle file change and import status
    const handleFileChange = (files: File[], uploadedConfig: object) => {
        setConfig(uploadedConfig);
        form.reset(uploadedConfig);
        // Optionally, handle other logic like setting form data or custom actions
    };

    const handleTypeChange = (selectedValue: string) => {
        const selectedType = SelectPlaylistTypes.find((type) => type.value === selectedValue);
        setDescription(selectedType ? selectedType.description : "");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-1">
                    <p className="text-dark-700">Create a 📜</p>
                    <h1 className="header text-white">New Playlist</h1>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    name="active"
                    label="Active"
                    control={form.control}
                />
                <div className="flex flex-col gap-4 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="playlistName"
                        label="Name"
                        placeholder="Enter playlist name"
                        control={form.control}/>
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        name="description"
                        label="Description"
                        placeholder="Description"
                        control={form.control}/>
                </div>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="type"
                    label="Playlist Type"
                    placeholder="Select Playlist Type"
                    description={description}
                    onValueChange={handleTypeChange}
                    control={form.control}>
                    {SelectPlaylistTypes.map(item => (
                        <SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="repeat"
                    label="Resuming Period"
                    placeholder="Select Resuming Period"
                    control={form.control}>
                    {ResumeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="emptyReplacer"
                    label="Index of playlist to replace with when empty"
                    placeholder="Index of playlist to replace with when empty"
                    inputType="number"
                    control={form.control}/>

                <section className="space-y-6">
                    <div className="mb-4 space-y-1">
                        <h1 className="sub-header text-white">SeekTo Section</h1>
                    </div>
                </section>
                <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                    <div className="flex flex-col gap-4 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name="program"
                            label="SeekTo Starting program index (0-based)"
                            placeholder="Enter SeekTo Starting program index (0-based)"
                            control={form.control}/>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name="position"
                            label="SeekTo position (milliseconds)"
                            placeholder="Enter SeekTo position"
                            control={form.control}/>
                    </div>
                </div>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="urlOrFolder"
                    label="Stream URL"
                    placeholder="Enter Stream URL"
                    control={form.control}/>
                <div className="flex flex-col gap-4 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        name="usingExternalStorage"
                        label="Using external Storage"
                        control={form.control}
                    />
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        name="playingGeneralBumpers"
                        label="Playing General Bumpers"
                        control={form.control}
                    />
                </div>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="specialBumperFolder"
                    label="Special Bumper folder name"
                    placeholder="e.g Special/{folder name}"
                    control={form.control}/>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="color"
                    label="Preview Color"
                    placeholder="Choose a playlist color"
                    control={form.control}>
                    {ColorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{backgroundColor: color.value}}
                                ></div>
                                <span>{color.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    name="logo"
                    label="Logo Type"
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                {logoTypes.map((type) => (
                                    <div key={type.value}
                                         className="radio-group">
                                        <RadioGroupItem
                                            value={type.value}
                                            className="shad-input-label"
                                            id={type.value}/>
                                        <Label className="cursor-pointer shad-input-label"
                                               htmlFor={type.value}>{type.name}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-4 space-y-1">
                        <h1 className="sub-header text-white">Ticker News/Notifications Section</h1>
                    </div>
                </section>
                <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        name="messages"
                        label="Ticker News/Notifications Separated by #"
                        placeholder="Message separated by #"
                        control={form.control}/>
                    <div className="flex flex-col gap-4 xl:flex-row mt-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name="starts"
                            label="Starting minutes Separated by #"
                            placeholder="When (nth) minutes after start separated by #"
                            control={form.control}/>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name="newsReplays"
                            label="Replays"
                            placeholder="Enter number of replays of ticker news for every (nth) minute"
                            inputType="number"
                            control={form.control}/>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            name="speed"
                            label="Ticker Speed"
                            placeholder="Choose a ticker Speed"
                            control={form.control}>
                            {SpeedTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </CustomFormField>
                    </div>
                </div>
                <section className="space-y-6">
                    <div className="mb-4 space-y-1">
                        <h1 className="sub-header text-white">Lower thirds Section</h1>
                    </div>
                </section>
                <LowerthirdTable/>
                <div className="flex flex-col gap-4 xl:flex-row">
                    <RegularButton isLoading={isLoading} className="shad-blue-btn">
                        Clear
                    </RegularButton>
                    <RegularButton isLoading={isLoading} className="shad-danger-btn">
                        Cancel
                    </RegularButton>
                    <ExportButton isLoading={isLoading}>
                        Create Playlist
                    </ExportButton>
                </div>
            </form>
        </Form>
    )
}
export default CreatePlaylistForm;
