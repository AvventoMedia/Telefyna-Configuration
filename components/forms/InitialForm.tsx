"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form, FormControl,
} from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField";
import ExportButton from "@/components/ExportButton";
import {useEffect, useRef, useState} from "react";
import {TelefynaFormValidation} from "@/lib/validation";
import FileUploader from "@/components/FileUploader";
import {TelefynaFormDefaultValues} from "@/constants";
import {getConfigJson, modifyConfig} from "@/lib/utils";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    DATE_PICKER = 'datepicker',
    SELECT= 'select',
    MULTI_SELECT= 'multiselect',
    SKELETON = 'skeleton',
}



const InitialForm = () => {
    const isInitialized = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-1">
                    <p className="text-dark-700">Hi there 👋</p>
                    <h1 className="header text-white">Scheduler</h1>
                </section>
                <div className="flex flex-col gap-4 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="name"
                        label="Name"
                        placeholder="Name"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="name"
                        control={form.control}/>
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="version"
                        label="Version"
                        placeholder="Version"
                        iconSrc="/assets/icons/version.svg"
                        iconAlt="version"
                        control={form.control}/>
                </div>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="wait"
                    label="Pinging time (seconds)"
                    placeholder="Pinging time (seconds)"
                    iconSrc="/assets/icons/timer.svg"
                    inputType="number"
                    iconAlt="wait"
                    description="time to keep checking the player and wait for internet connection"
                    control={form.control}/>
                <section className="space-y-6">
                    <div className="mb-4 space-y-1">
                        <h1 className="sub-header text-white">Notifications and Automation</h1>
                    </div>
                </section>
                <div className="flex flex-col gap-2 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        name="automationDisabled"
                        label="Disable Automation"
                        control={form.control}
                    />
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        name="notificationsDisabled"
                        label="Disable OS Notifications"
                        control={form.control}
                    />
                </div>
                {/*<CustomFormField*/}
                {/*    fieldType={FormFieldType.MULTI_SELECT}*/}
                {/*    name="notificationsDisabled"*/}
                {/*    label="Disable OS Notifications"*/}
                {/*    placeholder="Enter something"*/}
                {/*    control={form.control}*/}
                {/*/>*/}
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    name="configJsonFile"
                    label="Import Config File"
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={handleFileChange}/>
                        </FormControl>
                    )}/>
                <div className="flex flex-col gap-4 xl:flex-row">
                    <ExportButton isLoading={isLoading}>
                        Export
                    </ExportButton>
                </div>
            </form>
        </Form>
    )
}
export default InitialForm
