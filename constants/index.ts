export enum PlaylistType {
    ONLINE = 'ONLINE',
    LOCAL_SEQUENCED = 'LOCAL_SEQUENCED',
    LOCAL_RANDOMIZED = 'LOCAL_RANDOMIZED',
    LOCAL_RESUMING = 'LOCAL_RESUMING',
    LOCAL_RESUMING_SAME = 'LOCAL_RESUMING_SAME',
    LOCAL_RESUMING_NEXT = 'LOCAL_RESUMING_NEXT',
    LOCAL_RESUMING_ONE = 'LOCAL_RESUMING_ONE',
}

export enum ResumingType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    ANNUALLY = 'ANNUALLY',
}

export enum SpeedType {
    SLOW = 'SLOW',
    FAST = 'FAST',
    VERY_FAST = 'VERY_FAST',
}

export enum LogoPosition {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
}

export const TelefynaFormDefaultValues = {
    name: "",
    version: "",
    wait: 0,
    automationDisabled: false,
    notificationsDisabled: true,
};

export const PlaylistFormDefaultValues = {
    active: true,
    playlistName: "",
    description: "",
    type: PlaylistType.ONLINE,
    repeat: "",
    emptyReplacer: 0,
    seekTo: {
        program: 0,
        position: 0
    },
    graphics:{
        displayLogo: false,
        displayLiveLogo: false,
        displayRepeatWatermark: false,
        logoPosition: "",
        news: {
            newsReplays: 0,
            speed: "FAST",
            starts: "",
            messages: "",
        },
        lowerThirds: [],
    },
    urlOrFolder: "",
    playingGeneralBumpers: false,
    usingExternalStorage: false,
    specialBumperFolder: "",
    color: "",
    logo: "",
};

export const SelectPlaylistTypes = [
    {
        name: "Online Stream",
        value: PlaylistType.ONLINE,
        description: "An Online streaming playlist using a stream url with NO support for bumper"
    },
    {
        name: "Local sequenced folder",
        value: PlaylistType.LOCAL_SEQUENCED,
        description: "A local playlist starting from the first to the last alphabetical program by file naming with support for bumpers"
    },
    {
        name: "Local random folder",
        value: PlaylistType.LOCAL_RANDOMIZED,
        description: "A local playlist randomly selecting programs with support for bumpers"
    },
    {
        name: "Local resuming folder",
        value: PlaylistType.LOCAL_RESUMING,
        description: "A local playlist resuming from the previous program at exact stopped time with NO support for bumper"
    },
    {
        name: "Local same resuming folder",
        value: PlaylistType.LOCAL_RESUMING_SAME,
        description: "A local playlist restarting the previous non completed program on the next playout with NO support for bumper"
    },
    {
        name: "Local next resuming folder",
        value: PlaylistType.LOCAL_RESUMING_NEXT,
        description: "A local playlist resuming from the next program with NO support for bumper"
    },
    {
        name: "Local one program per resuming period folder",
        value: PlaylistType.LOCAL_RESUMING_ONE,
        description: "A local one program selection playlist resuming from the next program with NO support for bumper"
    },
];

export const ColorOptions = [
    { name: "Teal", value: "#00cc99" },
    { name: "Sky Blue", value: "#00ccff" },
    { name: "Blue", value: "#6666ff" },
    { name: "Green", value: "#28a745" },
    { name: "Yellow", value: "#ffff66" },
    { name: "Light Green", value: "#66ff33" },
    { name: "Orange", value: "#ff6600" },
    { name: "Pink", value: "#ff33cc" },
    { name: "Grey", value: "#666699" },
    { name: "Light Grey", value: "#e0ebeb" },
    { name: "Purple", value: "#990099" },
    { name: "Dark Red", value: "#993333" },
    { name: "Grey", value: "#808080" },
    { name: "Lavender", value: "#ccccff" },
    { name: "Dark Green", value: "#336600" },
    { name: "Light Lime", value: "#99ff99" },
    { name: "Aqua", value: "#66ffcc" },
    { name: "Mint", value: "#ccffcc" },
    { name: "Light Pink", value: "#ffccff" },
    { name: "Dark Blue", value: "#0060aa" },
    { name: "Amber", value: "#f9b724" },
    { name: "Brown", value: "#775549" },
    { name: "Indigo", value: "#2c0f7d" },
    { name: "Slate", value: "#607d8b" }
];

export const logoTypes = [
    {
        name: "Display Logo (telefyna/logo.png)",
        value: "displayLogo"
    },
    {
        name: "Display Live Logo (telefyna/watermark/live.png)",
        value: "displayLiveLogo"
    },
];
export const SpeedTypes = [
    {name: "Slow", value: SpeedType.SLOW},
    {name: "Fast", value: SpeedType.FAST},
    {name: "Very Fast", value: SpeedType.VERY_FAST}
]

export const ResumeTypes = [
    {name:"Daily", value: ResumingType.DAILY},
    {name:"Weekly", value: ResumingType.WEEKLY},
    {name:"Monthly", value: ResumingType.MONTHLY},
    {name:"Quarterly", value: ResumingType.QUARTERLY},
    {name:"Annually", value: ResumingType.ANNUALLY}
]
type Mailer = {
    host: string;
    port: number;
    email: string;
    pass: string;
};

type Alerts = {
    enabled: boolean;
    mailer: Mailer;
    subscribers: string[];
};

// Define the shape of the "graphics" section
type Graphics = {
    displayLogo: boolean;
    logoPosition: LogoPosition;
    news: {
        replays: number;
        speed:  SpeedType;
        starts: string,
        messages: string
    };
    lowerThirds: any[];
    displayLiveLogo?: boolean;
    displayRepeatWatermark?: boolean;
};

export type Schedule = {
    schedule: number;
    start: string;
    days: number[];
    name: string;
    color: string;
    active: boolean;
    type: PlaylistType;
    graphics: Graphics;
};

// Define the shape of the "seekTo" section
type SeekTo = {
    program: number;
    position: number;
};

// Define the shape of each playlist
export type Playlist = {
    active: boolean;
    type: PlaylistType;
    usingExternalStorage: boolean;
    seekTo: SeekTo;
    graphics: Graphics;
    name: string;
    description?: string;
    urlOrFolder: string;
    color?: string;
    playingGeneralBumpers?: boolean;
    specialBumperFolder?: string;
    repeat?: ResumingType;
    emptyReplacer?: null | number;
};

// Define the shape of the main config object
export type Config = {
    name: string;
    lastModified?: string;
    version: string;
    automationDisabled: boolean;
    notificationsDisabled: boolean;
    wait: number;
    alerts?: Alerts;
    playlists?: Playlist[];
    schedules?: Schedule[];
};
