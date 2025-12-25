import axios from 'axios';
import type {
    SteamAppListResponse,
    SteamAppDetails,
    SteamSearchInput,
    SteamDetailsInput,
} from '../types.js';

const STEAM_APP_LIST_URL = 'https://api.steampowered.com/IStoreService/GetAppList/v1/';
const STEAM_APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';

// Cache for the app list to avoid repeated requests
let appListCache: SteamAppListResponse | null = null;
let appListCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

import { Config } from '../config.js';

/**
 * Search for games on Steam by name
 */
export async function searchSteamGames(input: SteamSearchInput, config: Config) {
    const { query, limit = 10 } = input;

    // Get or update app list cache
    const now = Date.now();
    if (!appListCache || now - appListCacheTime > CACHE_DURATION) {
        const response = await axios.get<SteamAppListResponse>(STEAM_APP_LIST_URL, {
            params: {
                key: config.steamApiKey,
                max_results: 50000,
            }
        });
        appListCache = response.data;
        appListCacheTime = now;
    }

    // Filter apps by query (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const apps = appListCache.response.apps || [];
    const matches = apps
        .filter((app) => app.name.toLowerCase().includes(lowerQuery))
        .slice(0, limit);

    return {
        results: matches,
        count: matches.length,
    };
}

/**
 * Get detailed information about a Steam game by App ID
 */
export async function getSteamGameDetails(input: SteamDetailsInput, _config: Config) {
    const { appid } = input;

    const response = await axios.get<{ [key: string]: SteamAppDetails }>(
        STEAM_APP_DETAILS_URL,
        {
            params: { appids: appid },
        }
    );

    const details = response.data[appid];

    if (!details || !details.success) {
        throw new Error(`Game with App ID ${appid} not found or unavailable`);
    }

    const data = details.data!;

    return {
        appid: data.steam_appid,
        name: data.name,
        type: data.type,
        description: data.short_description,
        detailed_description: data.detailed_description,
        about: data.about_the_game,
        header_image: data.header_image,
        capsule_image: data.capsule_image,
        website: data.website,
        developers: data.developers || [],
        publishers: data.publishers || [],
        price: data.price_overview,
        platforms: data.platforms,
        categories: data.categories?.map((c) => c.description) || [],
        genres: data.genres?.map((g) => g.description) || [],
        release_date: data.release_date,
        is_free: data.is_free,
        supported_languages: data.supported_languages,
    };
}
