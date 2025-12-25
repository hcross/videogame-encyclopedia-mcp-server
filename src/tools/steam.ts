import axios from 'axios';
import type {
    SteamStoreSearchResponse,
    SteamAppDetails,
    SteamSearchInput,
    SteamDetailsInput,
} from '../types.js';
import { Config } from '../config.js';

const STORE_SEARCH_URL = 'https://store.steampowered.com/api/storesearch/';
const STEAM_APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';

/**
 * Search for games on Steam by name using the public Store Search API
 */
export async function searchSteamGames(input: SteamSearchInput) {
    const { query, limit = 10 } = input;

    const response = await axios.get<SteamStoreSearchResponse>(STORE_SEARCH_URL, {
        params: {
            term: query,
            l: 'english',
            cc: 'US'
        }
    });

    const matches = response.data.items.map(item => ({
        appid: item.id,
        name: item.name
    })).slice(0, limit);

    return {
        results: matches,
        count: matches.length,
    };
}

/**
 * Get detailed information about a Steam game by App ID
 */
export async function getSteamGameDetails(input: SteamDetailsInput) {
    const { appid } = input;

    const response = await axios.get<{ [key: string]: { success: boolean; data?: SteamAppDetails } }>(
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
        categories: data.categories?.map((c: any) => c.description) || [],
        genres: data.genres?.map((g: any) => g.description) || [],
        release_date: data.release_date,
        is_free: data.is_free,
        supported_languages: data.supported_languages,
    };
}
