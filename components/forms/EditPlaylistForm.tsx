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
import {getConfigJson, getFilteredPlaylists, modifyConfig} from "@/lib/utils";
import RegularButton from "@/components/RegularButton";
import {SelectItem} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group"
import {RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import LowerthirdTable from "@/components/LowerthirdTable";
import {FormFieldType} from "@/components/forms/InitialForm";
import {Option} from "@/components/ui/multipleselector";

const EditPlaylistForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(SelectPlaylistTypes[1].description);
    const [selectedPlaylistType, setSelectedPlaylistType] = useState<string>("");
    const getPlaylists = getFilteredPlaylists(getConfigJson() ?? {playlists: []}, true, true);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Option | null>(null);

    const showSeekToFieldTypes = [
        PlaylistType.LOCAL_RESUMING,
        PlaylistType.LOCAL_RESUMING_ONE,
        PlaylistType.LOCAL_RESUMING_NEXT,
        PlaylistType.LOCAL_RESUMING_SAME
    ];

    interface PlaylistTypeCheck {
        type: PlaylistType;
    }

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


    function handleUpdatePlaylist(data: z.infer<typeof PlaylistFormValidation>) {
        setIsLoading(true);

        const updatedPlaylist: Playlist = {
            active: data.active,
            type: data.type.trim() as PlaylistType,
            usingExternalStorage: data.usingExternalStorage ?? false,
            seekTo: {
                program: data.seekTo?.program ?? 0,
                position: data.seekTo?.position ?? 0,
            },
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
            name: data.playlistName.trim(),
            description: data.description?.trim(),
            urlOrFolder: data.urlOrFolder.trim(),
            color: data.color?.trim(),
            playingGeneralBumpers: data.playingGeneralBumpers ?? false,
            repeat: data.repeat as ResumingType,
            emptyReplacer: data.emptyReplacer ?? null,
            specialBumperFolder: data.specialBumperFolder?.trim() ?? "",
        };

        const storedConfig = getConfigJson();

        // Locate the playlist by name or other identifier
        const playlistIndex = storedConfig.playlists?.findIndex(
            (playlist: Playlist) => playlist.name === selectedPlaylist?.value
        );

        if (playlistIndex !== undefined && playlistIndex > -1) {
            // Update the selected playlist
            storedConfig.playlists[playlistIndex] = updatedPlaylist;

            // Save the updated config
            modifyConfig(storedConfig);

            console.log('Config after updating playlist:', storedConfig);
        } else {
            console.error("Playlist not found for updating.");
        }

        setIsLoading(false);
    }


    const handleTypeChange = (selectedValue: string) => {
        const selectedType = SelectPlaylistTypes.find((type) => type.value === selectedValue);
        setSelectedPlaylistType(selectedType ? selectedType.value as PlaylistType :"");
        setDescription(selectedType ? selectedType.description : "");
        createForm.setValue("type", selectedType ? selectedType.value as PlaylistType : PlaylistType.ONLINE);
    };

    function isPlaylist(obj: any): obj is PlaylistTypeCheck {
        return obj && typeof obj === 'object' && 'type' in obj;
    }

    // Use the type guard in your code
    const streamUrlLabel = selectedPlaylist && isPlaylist(selectedPlaylist.playlist) && selectedPlaylist.playlist.type === PlaylistType.ONLINE
        ? "Stream URL"
        : "Local folder name (separate with # to add other folders)";


    const handleLogoChange = (selectedValue: string) => {
        console.log("Selected playlist logo:", selectedValue);
        // Set the selected logo to true and others to false
        createForm.setValue("graphics.displayLogo", selectedValue === "displayLogo");
        createForm.setValue("graphics.displayLiveLogo", selectedValue === "displayLiveLogo");
    };

    const clearAllFields = () => {
        createForm.reset();
    }

    const handlePlaylistSelection = (selectedValue: string) => {
        const selectedPlaylistData = getPlaylists.find((playlist) => playlist.value === selectedValue);
console.log('Selected playlist data:', selectedPlaylistData , selectedValue, getPlaylists);
        if (selectedPlaylistData) {
            setSelectedPlaylist(selectedPlaylistData as Option);

            // Fetch playlist data based on selection
            const playlistData = getConfigJson()?.playlists.find(
                (playlist :Playlist) => playlist.name === selectedPlaylistData.value
            );

            // Update form fields with selected playlist data
            if (playlistData) {
                setSelectedPlaylistType(playlistData.type as string);
                handleTypeChange(playlistData.type as string);

                createForm.reset({
                    active: playlistData.active,
                    playlistName: playlistData.name,
                    type: playlistData.type as PlaylistType,
                    color: playlistData.color,
                    description: playlistData.description,
                    urlOrFolder: playlistData.urlOrFolder,
                    playingGeneralBumpers: playlistData.playingGeneralBumpers,
                    repeat: playlistData.repeat,
                    emptyReplacer: playlistData.emptyReplacer,
                    specialBumperFolder: playlistData.specialBumperFolder,
                    usingExternalStorage: playlistData.usingExternalStorage,
                    seekTo: {
                        program: playlistData.seekTo.program,
                        position: playlistData.seekTo.position
                    },
                    graphics: {
                        displayLogo: playlistData.graphics.displayLogo,
                        logoPosition: playlistData.graphics.logoPosition,
                        news: {
                            newsReplays: playlistData.graphics.news.replays,
                            speed: playlistData.graphics.news.speed,
                            starts: playlistData.graphics.news.starts,
                            messages: playlistData.graphics.news.messages
                        },
                        lowerThirds: playlistData.graphics.lowerThirds,
                        displayLiveLogo: playlistData.graphics.displayLiveLogo,
                        displayRepeatWatermark: playlistData.graphics.displayRepeatWatermark
                    },
                    schedules: playlistData.schedules
                });
            }
        }
    };

    return (
        <Form {...createForm}>
            <form className="space-y-6 flex-1" onSubmit={createForm.handleSubmit(handleUpdatePlaylist)}>
                <section className="mb-12 space-y-1">
                    <p className="text-dark-700">Edit an 📜</p>
                    <h1 className="header text-white">Existing Playlist</h1>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.COMBO_BOX}
                    name="select"
                    label="Select Playlist to edit"
                    placeholder="Select Playlist to edit"
                    selectOptions={getPlaylists}
                    onChange={handlePlaylistSelection}
                    control={createForm.control}/>
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
                        onValueChange={handleTypeChange}
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
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleLogoChange(value);
                                            }}
                                            value={
                                                createForm.watch("graphics.displayLogo")
                                                    ? "displayLogo"
                                                    : createForm.watch("graphics.displayLiveLogo")
                                                        ? "displayLiveLogo"
                                                        : "none"
                                            }>
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
export default EditPlaylistForm;
