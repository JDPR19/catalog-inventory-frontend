import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BaseUrl } from "./BaseUrl"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('https')) return path;
    return `${BaseUrl}/uploads/${path}`;
}
