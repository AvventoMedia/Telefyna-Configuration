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
import {PlaylistFormValidation} from "@/lib/validation";
import {
    ColorOptions,
    LogoPosition, LogoPositionType,
    logoTypes, Playlist, PlaylistFormDefaultValues, PlaylistType,
    ResumeTypes, ResumingType,
    SelectPlaylistTypes, SpeedType,
    SpeedTypes,
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
    const [selectedPlaylistType, setSelectedPlaylistType] = useState<string>("");

    const showSeekToFieldTypes = [
        PlaylistType.LOCAL_RESUMING,
        PlaylistType.LOCAL_RESUMING_ONE,
        PlaylistType.LOCAL_RESUMING_NEXT,
        PlaylistType.LOCAL_RESUMING_SAME
    ];

    const showBumperFieldTypes = [
        PlaylistType.LOCAL_SEQUENCED,
        PlaylistType.LOCAL_RANDOMIZED,
    ];
    const createForm = useForm<z.infer<typeof PlaylistFormValidation>>({
        resolver: zodResolver(PlaylistFormValidation),
        defaultValues: {
            ...PlaylistFormDefaultValues
        },
    })
    // console.log("Values: ",createForm.getValues());
    // console.log("Errors: ",createForm.formState.errors);

    function handleCreatePlaylist(data: z.infer<typeof PlaylistFormValidation>) {
       setIsLoading(true)
        // Create new playlist object from form data
        const newPlaylist: Playlist = {
            active: data.active,
            type: data.type as PlaylistType,
            usingExternalStorage: data.usingExternalStorage ?? false,
            // seekTo field
            seekTo: {
                program: data.seekTo?.program ?? 0,
                position: data.seekTo?.position ?? 0
            },
            // Graphics field
            graphics: {
                displayLogo: data.graphics?.displayLogo ?? false,
                logoPosition: data.graphics?.logoPosition as LogoPosition,
                news: {
                    replays: data.graphics?.news?.newsReplays ?? 0,
                    speed: data.graphics?.news?.speed as SpeedType,
                    starts: data.graphics?.news?.starts ?? "",
                    messages: data.graphics?.news?.messages ?? "",
                },
                lowerThirds: data.graphics?.lowerThirds ?? [],
                displayLiveLogo: data.graphics?.displayLiveLogo ?? false,
                displayRepeatWatermark: data.graphics?.displayRepeatWatermark ?? false,
            },

            name: data.playlistName,
            description: data.description,
            urlOrFolder: data.urlOrFolder,
            color: data.color,
            playingGeneralBumpers: data.playingGeneralBumpers ?? false,
            repeat: data.repeat as ResumingType,
            emptyReplacer: data.emptyReplacer ?? null,
            specialBumperFolder: data.specialBumperFolder ?? ""
        };


        // Retrieve current config from localStorage
        const storedConfig = getConfigJson();

        // Add new playlist to the playlists array
        storedConfig.playlists?.push(newPlaylist);

        // Save updated config to localStorage
        modifyConfig(storedConfig);

        console.log('Config after adding new playlist:', storedConfig);
        setIsLoading(false)
    }

    const handleTypeChange = (selectedValue: string) => {
        const selectedType = SelectPlaylistTypes.find((type) => type.value === selectedValue);
        setSelectedPlaylistType(selectedType ? selectedType.value as PlaylistType :"");
        setDescription(selectedType ? selectedType.description : "");
    };

    // Determine the label text based on the playlist type
    const streamUrlLabel = selectedPlaylistType === PlaylistType.ONLINE
        ? "Stream URL"
        : "Local folder name (separate with # to add other folders)";


    const handleLogoChange = (selectedValue: string) => {
        // Set the selected logo to true and others to false
        createForm.setValue("graphics.displayLogo", selectedValue === "displayLogo");
        createForm.setValue("graphics.displayLiveLogo", selectedValue === "displayLiveLogo");
    };

    const clearAllFields = () => {
        createForm.reset();
    }

    return (
        <Form {...createForm}>
            <form className="space-y-6 flex-1" onSubmit={createForm.handleSubmit(handleCreatePlaylist)}>
                <section className="mb-12 space-y-1">
                    <p className="text-dark-700">Create a 📜</p>
                    <h1 className="header text-white">New Playlist</h1>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    name="active"
                    label="Active"
                    control={createForm.control}
                />
                <div className="flex flex-col gap-4 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="playlistName"
                        label="Name"
                        placeholder="Enter playlist name"
                        control={createForm.control}/>
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        name="description"
                        label="Description"
                        placeholder="Description"
                        control={createForm.control}/>
                </div>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="type"
                    label="Playlist Type"
                    placeholder="Select Playlist Type"
                    description={description}
                    onValueChange={handleTypeChange}
                    control={createForm.control}>
                    {SelectPlaylistTypes.map(item => (
                        <SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>
                    ))}
                </CustomFormField>

                {selectedPlaylistType === PlaylistType.LOCAL_RESUMING_ONE && (
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        name="repeat"
                        label="Resuming Period"
                        placeholder="Select Resuming Period"
                        control={createForm.control}>
                        {ResumeTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
                        ))}
                    </CustomFormField>
                )}

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="emptyReplacer"
                    label="Index of playlist to replace with when empty"
                    placeholder="Index of playlist to replace with when empty"
                    inputType="number"
                    control={createForm.control}/>

                {showSeekToFieldTypes.includes(selectedPlaylistType as PlaylistType) && (
                    <>
                        <section className="space-y-6">
                            <div className="mb-4 space-y-1">
                                <h1 className="sub-header text-white">SeekTo Section</h1>
                            </div>
                        </section>
                        <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                            <div className="flex flex-col gap-4 xl:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    name="seekTo.program"
                                    label="SeekTo Starting program index (0-based)"
                                    placeholder="Enter SeekTo Starting program index (0-based)"
                                    control={createForm.control}/>
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    name="seekTo.position"
                                    label="SeekTo position (milliseconds)"
                                    placeholder="Enter SeekTo position"
                                    control={createForm.control}/>
                            </div>
                        </div>
                    </>
                )}

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="urlOrFolder"
                    label={streamUrlLabel}
                    placeholder={selectedPlaylistType === PlaylistType.ONLINE ? "Enter Stream URL" : "Enter Local folder name"}
                    control={createForm.control}/>
                {selectedPlaylistType !== PlaylistType.ONLINE && (
                    <>
                        <div className="flex flex-col gap-6 xl:flex-row">
                            {showBumperFieldTypes.includes(selectedPlaylistType as PlaylistType) && (
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    name="playingGeneralBumpers"
                                    label="Playing General Bumpers"
                                    control={createForm.control}
                                />
                            )}
                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                name="usingExternalStorage"
                                label="Using external Storage"
                                description="Playlist, bumper and lowerThird folders will be retrived from the
                                /telefyna folder in SDCard/USB drive attached if any exists else Internal storage"
                                control={createForm.control}
                            />
                        </div>
                        {showBumperFieldTypes.includes(selectedPlaylistType as PlaylistType) && (
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                name="specialBumperFolder"
                                label="Special Bumper folder name"
                                placeholder="e.g Special/{folder name}"
                                control={createForm.control}/>
                        )}
                    </>
                )}
                <div className="!mt-12">
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        name="color"
                        label="Preview Color"
                        placeholder="Choose a playlist color"
                        control={createForm.control}>
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
                </div>
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        name="logo"
                        label="Logo Type"
                        control={createForm.control}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleLogoChange(value);
                                            }}
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
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="graphics.logoPosition"
                    label="Logo Position"
                    placeholder="Select logo position"
                    control={createForm.control}>
                    {LogoPositionType.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
                    ))}
                </CustomFormField>
                    <section className="space-y-6">
                        <div className="mb-4 space-y-1">
                            <h1 className="sub-header text-white">Ticker News/Notifications Section</h1>
                        </div>
                    </section>
                    <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            name="graphics.news.messages"
                            label="Ticker News/Notifications Separated by #"
                            placeholder="Message separated by #"
                            control={createForm.control}/>
                        <div className="flex flex-col gap-4 xl:flex-row mt-4">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                name="graphics.news.starts"
                                label="Starting minutes Separated by #"
                                placeholder="When (nth) minutes after start separated by #"
                                control={createForm.control}/>
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                name="graphics.news.newsReplays"
                                label="Replays"
                                placeholder="Enter number of replays of ticker news for every (nth) minute"
                                inputType="number"
                                control={createForm.control}/>
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                name="graphics.news.speed"
                                label="Ticker Speed"
                                placeholder="Choose a ticker Speed"
                                control={createForm.control}>
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
                        <RegularButton isLoading={isLoading} className="shad-blue-btn" onClick={clearAllFields}>
                            Clear
                        </RegularButton>
                        <RegularButton isLoading={isLoading} className="shad-danger-btn">
                            Cancel
                        </RegularButton>
                        <ExportButton isLoading={isLoading} >
                            Create Playlist
                        </ExportButton>
                    </div>
            </form>
        </Form>
)
}
export default CreatePlaylistForm;
