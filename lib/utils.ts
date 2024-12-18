import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {Config} from "@/constants";
import {Option} from "@/components/forms/DeletePlaylistScheduleForm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
      "en-US",
      dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
      "en-US",
      dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
      "en-US",
      dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
      "en-US",
      timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

// Get the 'configJson' item from localStorage and parse it as JSON
export function getConfigJson() {
  if (typeof window === 'undefined') {
    return null;
  }
  const config = localStorage.getItem('configJson');
  return config ? JSON.parse(config) : null;
}

// Clear the 'configJson' item from localStorage
export function clearConfigJson() {
  localStorage.removeItem('configJson');
}

// Modify and save config to localStorage
export function modifyConfig(config: any) {
  const updatedConfig = {
    ...config,
    lastModified: new Date().toLocaleString()
  };
  localStorage.setItem('configJson', JSON.stringify(updatedConfig));
  return updatedConfig;
}

// Export config as a downloadable JSON file
export function exportConfig(config: any) {
  const dataStr = JSON.stringify(config, null, 2); // Format JSON for readability
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to download the JSON file
  const link = document.createElement('a');
  link.href = url;
  link.download = 'config.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object after download
  URL.revokeObjectURL(url);
}

/**
 * Function to retrieve playlists with optional details and active filter
 */
export const getFilteredPlaylists = (
    config: Config,
    fullySpecified: boolean = false,
    filterActive: boolean = true
): Option[] => {
  return (config.playlists ?? [])
      .map((playlist, index) => ({ ...playlist, index }))
      .filter((playlist) => !filterActive || playlist.active)
      .sort((a, b) => a.index - b.index) // Sorting by index number
      .map((playlist, index) => {
        // Emoji for active/inactive status
        const statusIcon = playlist.active ? "✅" : "❌";

        // Base name with optional status icon
        let name = fullySpecified ? `${statusIcon} ${playlist.name}` : playlist.name;

        // Additional details if fully specified
        if (fullySpecified) {
          name += ` #${index + 1}`;
        }

        return {
          label: name,
          value: playlist.name.trim(),
          playlist: playlist,
        };
      });
};


export const getFilteredSchedules = (
    config: Config,
    fullySpecified: boolean = false,
    filterActive: boolean = true
): Option[] => {
  const schedulesArray = Array.isArray(config.schedules) ? config.schedules : [];
  console.log('Filtered schedules array:', schedulesArray);

  return schedulesArray
      .map((schedule, index) => ({ ...schedule, index }))
      .filter((schedule) => !filterActive || schedule.active)
      .sort((a, b) => a.index - b.index)
      .map((schedule, index) => {
        const statusIcon = schedule.active ? "✅" : "❌";
        let scheduleName = fullySpecified ? `${statusIcon} ${schedule.name}` : schedule.name;

        if (fullySpecified) {
          scheduleName += ` #${index + 1}`;
          if (schedule.start) scheduleName += ` | @${schedule.start}`;
          if (schedule.days?.length > 1) scheduleName += ` | Days: ${schedule.days.join(",")}`;
        }

        return {
          label: scheduleName,
          value: scheduleName,
          schedules: schedule,
          key: schedule.name.trim(),
        };
      });
};


export const deleteAllSchedules = (config: Config): Config => {
  return {
    ...config,
    schedules: [],
  };
};



export const generateTimeSlots =() => {
  const timeSlots = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourString = hour < 10 ? `0${hour}` : `${hour}`;
    timeSlots.push({ label: `${hourString}:00`, value: `${hourString}:00` });
    timeSlots.push({ label: `${hourString}:30`, value: `${hourString}:30` });
  }

  return timeSlots;
}