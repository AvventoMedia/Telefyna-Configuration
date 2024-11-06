export const TelefynaFormDefaultValues = {
    name: "",
    version: "",
    wait: 0,
    email: "",
    scheduleDate: new Date(Date.now()),
    automationDisabled: false,
    notificationsDisabled: true,
};

// Config design

enum PlaylistType {
    ONLINE = 'ONLINE',
    LOCAL_SEQUENCED = 'LOCAL_SEQUENCED',
    LOCAL_RANDOMIZED = 'LOCAL_RANDOMIZED',
    LOCAL_RESUMING = 'LOCAL_RESUMING',
    LOCAL_RESUMING_SAME = 'LOCAL_RESUMING_SAME',
    LOCAL_RESUMING_NEXT = 'LOCAL_RESUMING_NEXT',
    LOCAL_RESUMING_ONE = 'LOCAL_RESUMING_ONE',
}

enum SpeedType {
    SLOW = 'SLOW',
    FAST = 'FAST',
    VERY_FAST = 'VERY_FAST',
}

enum LogoPosition {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
}

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
export  type Playlist = {
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
    start?: string;
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