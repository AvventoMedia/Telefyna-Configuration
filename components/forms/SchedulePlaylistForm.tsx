"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form, FormControl,
} from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField";
import ExportButton from "@/components/ExportButton";
import React, {useState, useEffect} from "react";
import {ScheduleSchema} from "@/lib/validation";
import {
    Config,
    Days,
    LogoPositionType,
    logoTypes, Playlist, PlaylistFormDefaultValues, PlaylistType, Schedule, ScheduleFormDefaultValues,
    SpeedTypes,
} from "@/constants";
import {
    deleteAllSchedules,
    generateTimeSlots,
    getConfigJson,
    getFilteredPlaylists,
    getFilteredSchedules,
    modifyConfig
} from "@/lib/utils";
import RegularButton from "@/components/RegularButton";
import {SelectItem} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group"
import {RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import LowerthirdTable from "@/components/LowerthirdTable";
import {FormFieldType} from "@/components/forms/InitialForm";
import {Option} from "@/components/ui/multipleselector";

const SchedulePlaylistForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState(true);
    const getPlaylists = getFilteredPlaylists(getConfigJson() ?? {playlists: []}, true, true);
    const getSchedules =  getFilteredSchedules(getConfigJson() ?? {playlists: []}, true, false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Option | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Option | null>(null);
    const [selectedDays, setSelectedDays] = useState<Option[]>([]);
    const timeSlotsArray = generateTimeSlots() || [];

    const storedConfig = getConfigJson();

    const scheduleForm = useForm<z.infer<typeof ScheduleSchema>>({
        resolver: zodResolver(ScheduleSchema),
        defaultValues: {
            ...ScheduleFormDefaultValues
        },
    })

    useEffect(() => {
        const daysFromForm = scheduleForm.getValues("days") ?? [];

        setSelectedDays(daysFromForm as Option[]);
    }, [scheduleForm.getValues("days")]);


    function handleUpdateSchedule(data: z.infer<typeof ScheduleSchema>) {
        setIsLoading(true);

        const playlistIndex = storedConfig.playlists?.findIndex(
            (playlist: Playlist) => playlist.name === (selectedSchedule ? selectedSchedule.key : selectedPlaylist?.value)
        );
console.log('playlistIndex: ', playlistIndex,"schedule: ", selectedSchedule,);
        if (playlistIndex !== undefined && playlistIndex > -1) {
            const currentPlaylist = storedConfig.playlists[playlistIndex];

            // Determine if a schedule is selected or if we need to create a new one
            let updatedSchedule = null;
            const days = selectedDays.map((day: Option) => day.value);

            if (selectedSchedule) {
                // If a schedule is selected, update it
                updatedSchedule = {
                    active: data.active ?? currentPlaylist.schedules.active,
                    name: currentPlaylist.name,
                    days: days ?? currentPlaylist.schedules.days,
                    start: data.start ?? currentPlaylist.schedules.start,
                    dates: data.dates ?? currentPlaylist.schedules.dates,
                    type: currentPlaylist.type,

                    seekTo: currentPlaylist.seekTo,
                    graphics: {
                        displayLogo: data.graphics?.displayLogo ?? currentPlaylist.schedules.graphics.displayLogo,
                        displayLiveLogo: data.graphics?.displayLiveLogo ?? currentPlaylist.schedules.graphics.displayLiveLogo,
                        news: {
                            replays: data.graphics?.news?.newsReplays ?? currentPlaylist.schedules.graphics.news.replays,
                            speed: data.graphics?.news?.speed ?? currentPlaylist.schedules.graphics.news.speed,
                            starts: data.graphics?.news?.starts ?? currentPlaylist.schedules.graphics.news.starts,
                            messages: data.graphics?.news?.messages ?? currentPlaylist.schedules.graphics.news.messages,
                        },
                        lowerThirds: data.graphics?.lowerThirds ?? currentPlaylist.schedules.graphics.lowerThirds,
                        displayRepeatWatermark: data.graphics?.displayRepeatWatermark ?? currentPlaylist.schedules.graphics.displayRepeatWatermark,
                    }
                };
            } else {
                // If no schedule is selected, create a new one
                updatedSchedule = {
                    active: data.active,
                    name: currentPlaylist.name,
                    days: days,
                    start: data.start,
                    dates: data.dates,
                    type: currentPlaylist.type,
                    color: currentPlaylist.color,
                    seekTo: currentPlaylist.seekTo,
                    graphics: {
                        displayLogo: data.graphics?.displayLogo ?? false,
                        displayLiveLogo: data.graphics?.displayLiveLogo ?? false,
                        news: {
                            replays: data.graphics?.news?.newsReplays ?? 0,
                            speed: data.graphics?.news?.speed ?? "FAST",
                            starts: data.graphics?.news?.starts ?? "",
                            messages: data.graphics?.news?.messages ?? "",
                        },
                        lowerThirds: data.graphics?.lowerThirds ?? [],
                        displayRepeatWatermark: data.graphics?.displayRepeatWatermark ?? false,
                    }
                };
            }

            // Create the updated playlist object
            const updatedConfigSchedule = (selectedSchedule
                ? storedConfig.schedules.map((schedule: Schedule) => {
                    const updated = schedule.name === selectedSchedule.key
                        ? { ...schedule, ...updatedSchedule }
                        : schedule;
                    return updated;
                })
                : [...(storedConfig.schedules || []), updatedSchedule]
            );
            const updatedConfig: Config = {
                ...storedConfig,
                schedules: updatedConfigSchedule,
            };

            // Save the updated config
            modifyConfig(updatedConfig);

            console.log('Config after updating playlist:', storedConfig);
        } else {
            console.error("Playlist not found for updating.");
        }

        setIsLoading(false);
    }

    const handleLogoChange = (selectedValue: string) => {
        scheduleForm.setValue("graphics.displayLogo", selectedValue === "displayLogo");
        scheduleForm.setValue("graphics.displayLiveLogo", selectedValue === "displayLiveLogo");
    };

    const clearAllFields = () => {
        scheduleForm.reset();
    }

    const deleteAllPLaylistSchedules = () => {
        deleteAllSchedules(storedConfig);
    }

    const handlePlaylistSelection = (selectedValue: string) => {
        const selectedPlaylistData = getPlaylists.find((playlist) => playlist.value === selectedValue);
        const selectedScheduleData = getSchedules.find((schedule) => schedule.value === selectedValue);
        if (selectedScheduleData) {
            setSelectedSchedule(selectedScheduleData as Option);
        } else if (selectedPlaylistData) {
            setSelectedPlaylist(selectedPlaylistData as Option);
        }

        // Fill form with selected data (either playlist or schedule)
        const configData = getConfigJson();
        const playlistData = configData.playlists.find(
            (playlist: Playlist) => playlist.name === (selectedPlaylistData?.value)
        );

        if (selectedScheduleData) {
            const schedule = selectedScheduleData.schedules;
            scheduleForm.reset({
                active: schedule?.active ?? false,
                playlistName: schedule?.name ?? "",
                days:schedule?.days?.map(dayValue => {
                    const day = Days.find(d => d.value === dayValue); // Find the day object based on the value
                    return day ?
                        {
                            label: day.label,
                            value: day.value
                        } :
                        {
                            label: "",
                            value: dayValue
                        };
                }) ?? [],
                start: schedule?.start ?? "",
                dates: schedule?.dates?.map(date => ({
                    value: date,
                    label: date
                })) ?? [],
                type: (schedule?.type as PlaylistType) ?? undefined,
                color: schedule?.color ?? "",
                seekTo: schedule?.seekTo ?? {
                    program: undefined,
                    position: undefined },
                graphics: {
                    displayLogo: schedule?.graphics?.displayLogo ?? false,
                    displayLiveLogo: schedule?.graphics?.displayLiveLogo ?? false,
                    news: {
                        newsReplays: schedule?.graphics?.news?.replays ?? 0,
                        speed: schedule?.graphics?.news?.speed ?? "FAST",
                        starts: schedule?.graphics?.news?.starts ?? "",
                        messages: schedule?.graphics?.news?.messages ?? "",
                    },
                    lowerThirds: schedule?.graphics?.lowerThirds ?? [],
                    displayRepeatWatermark: schedule?.graphics?.displayRepeatWatermark ?? false,
                }
            });
        } else if (playlistData) {
            scheduleForm.reset({
                ...playlistData,
            });
        }

        setSchedule(false);
    };
    // console.log("Values: ",scheduleForm.getValues());
    // console.log("Errors: ",scheduleForm.formState.errors);

    return (
        <Form {...scheduleForm}>
            <form className="space-y-6 flex-1" onSubmit={scheduleForm.handleSubmit(handleUpdateSchedule)}>
                <section className="mb-12 space-y-1">
                    <p className="text-dark-700">Existing Playlist/Schedule</p>
                    <h1 className="header text-white">Schedule a 📜</h1>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.COMBO_BOX}
                    name="selectSchedule"
                    label="Select Playlist to edit"
                    placeholder="Select Playlist to edit"
                    selectOptions={[...getPlaylists,...getSchedules]}
                    onChange={handlePlaylistSelection}
                    control={scheduleForm.control}/>
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    name={"active"}
                    label="Active"
                    control={scheduleForm.control}
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.MULTI_SELECT}
                        name={"days"}
                        label="Weekly Day(s)"
                        placeholder="Select day or days"
                        badgeClassName="bg-green-700"
                        multiSelectOptions={Days}
                        onChange={(value) => {
                            setSelectedDays(() => value);
                        }}
                        control={scheduleForm.control}
                        description="If no Days or Dates are selected but start Time is defined,
                        the playlist schedules daily"/>
                    <CustomFormField
                        fieldType={FormFieldType.COMBO_BOX}
                        name={"start"}
                        label="Start Time"
                        placeholder="Choose Start Time"
                        value={scheduleForm.watch("start")}
                        selectOptions={timeSlotsArray}
                        control={scheduleForm.control} />
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        name={"dates"}
                        label="Date(s)"
                        control={scheduleForm.control}
                    />
                </div>

                <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        name="logo"
                        label="Logo Type"
                        control={scheduleForm.control}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleLogoChange(value);
                                            }}
                                            value={
                                                scheduleForm.watch("graphics.displayLogo" as "graphics.displayLogo")
                                                    ? "displayLogo"
                                                    : scheduleForm.watch("graphics.displayLiveLogo"as "graphics.displayLiveLogo")
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
                        name={"graphics.logoPosition"}
                        label="Logo Position"
                        placeholder="Select logo position"
                        control={scheduleForm.control}>
                        {LogoPositionType.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
                        ))}
                    </CustomFormField>
                </div>
                <section className="space-y-6">
                    <div className="mb-4 space-y-1">
                        <h1 className="sub-header text-white">Ticker News/Notifications Section</h1>
                    </div>
                </section>
                <div className="w-full p-4 border border-dark-500 rounded-lg shadow-md">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        name={"graphics.news.messages"}
                        label="Ticker News/Notifications Separated by #"
                        placeholder="Message separated by #"
                        control={scheduleForm.control}/>
                    <div className="flex flex-col gap-4 xl:flex-row mt-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name={"graphics.news.starts"}
                            label="Starting minutes Separated by #"
                            placeholder="When (nth) minutes after start separated by #"
                            control={scheduleForm.control}/>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            name={"graphics.news.newsReplays"}
                            label="Replays"
                            placeholder="Enter number of replays of ticker news for every (nth) minute"
                            inputType="number"
                            control={scheduleForm.control}/>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            name={"graphics.news.speed"}
                            label="Ticker Speed"
                            placeholder="Choose a ticker Speed"
                            control={scheduleForm.control}>
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
                    <RegularButton isLoading={isLoading} className="shad-danger-btn" onClick={deleteAllPLaylistSchedules}>
                        Delete All Schedules
                    </RegularButton>
                    <RegularButton isLoading={isLoading} className="shad-blue-btn" onClick={clearAllFields}>
                        Clear
                    </RegularButton>
                    <RegularButton isLoading={isLoading} className="shad-danger-btn">
                       Cancel
                    </RegularButton>
                    <ExportButton isLoading={schedule} name="Schedule">
                        Schedule
                    </ExportButton>
                </div>
            </form>
        </Form>
    )
}
export default SchedulePlaylistForm;
