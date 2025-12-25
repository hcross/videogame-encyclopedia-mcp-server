/**
 * Type definitions for Steam and SteamGridDB API responses
 */

// Steam API Types
export interface SteamApp {
    appid: number;
    name: string;
}

export interface SteamAppListResponse {
    response: {
        apps: SteamApp[];
        have_more_results?: boolean;
        last_appid?: number;
    };
}

export interface SteamAppDetails {
    success: boolean;
    data?: {
        name: string;
        type: string;
        steam_appid: number;
        required_age: number;
        is_free: boolean;
        detailed_description: string;
        short_description: string;
        about_the_game: string;
        supported_languages: string;
        header_image: string;
        capsule_image: string;
        capsule_imagev5: string;
        website?: string;
        developers?: string[];
        publishers?: string[];
        price_overview?: {
            currency: string;
            initial: number;
            final: number;
            discount_percent: number;
            initial_formatted: string;
            final_formatted: string;
        };
        platforms: {
            windows: boolean;
            mac: boolean;
            linux: boolean;
        };
        categories?: Array<{
            id: number;
            description: string;
        }>;
        genres?: Array<{
            id: string;
            description: string;
        }>;
        release_date: {
            coming_soon: boolean;
            date: string;
        };
    };
}

// SteamGridDB API Types
export interface SteamGridGame {
    id: number;
    name: string;
    types: string[];
    verified: boolean;
}

export interface SteamGridSearchResponse {
    success: boolean;
    data: SteamGridGame[];
}

export interface SteamGridAsset {
    id: number;
    url: string;
    thumb: string;
    width: number;
    height: number;
    mime: string;
    language: string;
    author: {
        name: string;
        steam64: string;
        avatar: string;
    };
}

export interface SteamGridAssetsResponse {
    success: boolean;
    data: SteamGridAsset[];
}

// MCP Tool Input Schemas
import { Config } from './config.js';

export interface SteamSearchInput {
    query: string;
    limit?: number;
}

export interface SteamDetailsInput {
    appid: number;
}


export interface SteamGridSearchInput {
    query: string;
}

export interface SteamGridAssetsInput {
    gameId: number;
    assetTypes?: ('grid' | 'hero' | 'logo' | 'icon')[];
}
