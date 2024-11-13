"use client"

import {useForm} from "react-hook-form"
import CustomFormField from "@/components/CustomFormField";
import ExportButton from "@/components/ExportButton";
import React, {useEffect, useState} from "react";
import {Playlist, Schedule} from "@/constants";
import {getConfigJson, getFilteredPlaylists, getFilteredSchedules, modifyConfig} from "@/lib/utils";
import RegularButton from "@/components/RegularButton";
import Image from "next/image";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
} from '@/components/ui/form';
import MultipleSelector from "@/components/ui/multipleselector";

const OPTIONS: Option[] = [
    { label: 'nextjs', value: 'Nextjs' },
    { label: 'React', value: 'react' },
    { label: 'Remix', value: 'remix' },
    { label: 'Vite', value: 'vite' },
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
    { label: 'Ember', value: 'ember', disable: true },
    { label: 'Gatsby', value: 'gatsby', disable: true },
    { label: 'Astro', value: 'astro' },
];

const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

const FormSchema = z.object({
    frameworks: z.array(optionSchema).min(1, {
        message: "At least one option must be selected.",
    }),
});

export enum FormFieldType {
    MULTI_SELECT= 'multiselect',
}

export interface Option {
    label: string;
    value: string;
    disable?: boolean;
}


const DeletePlaylistScheduleForm = () => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    // Load options from config on component mount
    useEffect(() => {
        loadOptionsFromConfig()
    }, [])

    useEffect(() => {
        if (selectedToDelete.length > 0) {
            handleDelete(selectedToDelete);
        }
    }, [selectedToDelete]);

    const loadOptionsFromConfig = () => {
        const savedConfig = getConfigJson()
        if (savedConfig && savedConfig.playlists) {
            // Filter active playlists
            const filteredPlaylists: Option[] = getFilteredPlaylists(savedConfig, true, true) || [];

            // Filter active schedules if schedules exist
            const filteredSchedules: Option[] = getFilteredSchedules(savedConfig, true, true) || [];

            const playlistSeparator: Option = {
                label: '--- Playlists ---',
                value: 'playlistSeparator',
                disable: true,
            };

            const scheduleSeparator: Option = {
                label: '--- Schedules ---',
                value: 'scheduleSeparator',
                disable: true,
            };


            // Combine playlists and schedules
            const filteredOptions: Option[] = [playlistSeparator,...filteredPlaylists, scheduleSeparator, ...filteredSchedules];

            if (JSON.stringify(filteredOptions) !== JSON.stringify(options)) {
                setOptions(filteredOptions)
            }
        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function handleDelete(selectedToDelete: string[]) {
        setLoading(true);

        try {
            const savedConfig = getConfigJson();

            // Filter out the items selected for deletion (both playlists and schedules)
            const updatedOptions = options.filter(
                (option) => !selectedToDelete.includes(option.value)
            );
            setOptions(updatedOptions);

            // Handle deletion of playlists
            savedConfig.playlists = savedConfig.playlists.filter(
                (playlist: Playlist) => {
                    // Check if playlist is selected for deletion (exact match)
                    const shouldDelete = selectedToDelete.includes(playlist.name);

                    // If the playlist is deleted, remove any schedules associated with it
                    if (shouldDelete && savedConfig.schedules) {
                        savedConfig.schedules = savedConfig.schedules.filter(
                            (schedule: Schedule) => schedule.name !== playlist.name
                        );
                    }

                    // Return true if playlist is not selected for deletion
                    return !shouldDelete;
                }
            );

            // Handle deletion of schedules
            savedConfig.schedules = savedConfig.schedules.filter(
                (schedule: Schedule) =>
                    !selectedToDelete.includes(`${schedule.name} ${schedule.start} ${schedule.schedule}`)
            );

            modifyConfig(savedConfig);
            // Reset the multi-select value in the form
            form.resetField("frameworks", { defaultValue: [] });
        } catch (error) {
            console.error("Error during deletion:", error);
        } finally {
            setLoading(false);
            // Clear the selection after deletion
            setSelectedToDelete([]);
        }
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setSelectedToDelete(data.frameworks.map((item) => item.value));
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-1">
                    <h1 className="header text-white">Delete Existing Playlist(s) | Schedule(s)</h1>
                    <p className="text-dark-700">Deleting the playlist will delete respective Schedules below it whereas
                        deleting schedule doesn't delete the respective playlist</p>
                </section>

                <div className="file-upload mb-6">
                    {options.length > 0 ? (
                        <CustomFormField
                            fieldType={FormFieldType.MULTI_SELECT}
                            name="frameworks"
                            label="Select Playlists(s) | Schedule(s)"
                            placeholder="Select to delete"
                            multiSelectOptions={options}
                            badgeClassName="bg-red-700"
                            control={form.control}
                        />
                    ) : (
                        <div className="flex items-center gap-4 text-white">
                            <Image src="/assets/icons/loader.svg"
                                   alt="loader"
                                   width={24} height={24}
                                   className="animate-spin"/>
                            Loading options...
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 xl:flex-row">
                    <RegularButton isLoading={loading} className="shad-blue-btn">
                        Cancel
                    </RegularButton>
                    <ExportButton isLoading={loading} className="shad-danger-btn">
                        Delete Selected
                    </ExportButton>
                </div>
            </form>
        </Form>
    );
};

export default DeletePlaylistScheduleForm
