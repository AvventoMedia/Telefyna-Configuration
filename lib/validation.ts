import {z} from "zod";
import {LogoPosition, PlaylistType, ResumingType} from "@/constants";

const SeekToSchema = z.object({
    program: z.number().min(0).optional().nullable(),
    position: z.number().min(0).optional().nullable(),
});

const newsSchema = z.object({
    newsReplays: z.number().int().nonnegative(
        { message: "Replays should be a non-negative integer." }).optional().nullable(),
    speed: z.string().min(1,
        { message: "Please choose a ticker speed." }).optional().nullable(),
    starts: z.string().optional().nullable(),
    messages: z.string().optional().nullable(),
});

const GraphicsSchema = z.object({
    displayLogo: z.boolean().optional().nullable(),
    displayLiveLogo: z.boolean().optional().nullable(),
    displayRepeatWatermark: z.boolean().optional().nullable(),
    logoPosition: z.string().optional().nullable(),
    news: newsSchema,
    lowerThirds: z.array(z.object({
        text: z.string().min(1,
            { message: "Lower third text must not be empty." }).optional().nullable(),
    })).optional().nullable(),
});

export const PlaylistFormValidation = z.object({
    active: z.boolean(),
    type: z.nativeEnum(PlaylistType,
        { message: "Please select a playlist type." }),
    usingExternalStorage: z.boolean().optional(),
    seekTo: SeekToSchema,
    graphics: GraphicsSchema,
    playlistName: z.string().min(2,
        { message: "Playlist name must be at least 2 characters." }),
    description: z.string().optional(),
    urlOrFolder: z.string().refine((val) => {
        // Check if the string is a valid URL using regex
        const isValidUrl = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i.test(val);
        return isValidUrl || val.length >= 2; // Folder name should be at least 2 characters
    }, {
        message: "Please enter a valid URL or a folder name (at least 2 characters).",
    }),
    color: z.string().optional(),
    playingGeneralBumpers: z.boolean().optional(),
    repeat: z.string().optional(),
    emptyReplacer: z.number().int().optional(),
    specialBumperFolder: z.string().optional().nullable(),
});

export const TelefynaFormValidation = z.object({
    name: z.string().min(2,
        { message: "Name must be at least 2 characters." }),
    version: z.string().min(3,
        { message: "Version must be at least 3 characters." }),
    email: z.string().email("Invalid email address."),
    wait: z.number().int().nonnegative(
        { message: "Wait time should not be negative." }),
    automationDisabled: z.boolean(),
    notificationsDisabled: z.boolean(),
});
