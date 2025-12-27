import axios from 'axios';
import type {
    SteamStoreSearchResponse,
    SteamAppDetails,
    SteamSearchInput,
    SteamDetailsInput,
    SteamDLCListInput,
    SteamDLC,
    SteamReviewsSummaryInput,
    SteamReviewsSummary,
    SteamReview,
    SteamTopGamesInput,
    SteamNewsInput,
    SteamNewsResponse,
    SteamNewsItem,
    SteamPlayerCountInput,
    SteamPlayerCountResponse,
} from '../types.js';
import { Config } from '../config.js';

const STORE_SEARCH_URL = 'https://store.steampowered.com/api/storesearch/';
const STEAM_APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';
const STEAM_REVIEWS_URL = 'https://store.steampowered.com/appreviews/';
const STEAM_NEWS_URL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/';
const STEAM_PLAYER_COUNT_URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/';

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

/**
 * Get a list of DLCs for a specific Steam game
 */
export async function getSteamDLCList(input: SteamDLCListInput) {
    const { appid } = input;

    // 1. Get the list of DLC App IDs from the main game's details
    const response = await axios.get<{ [key: string]: { success: boolean; data?: any } }>(
        STEAM_APP_DETAILS_URL,
        {
            params: { appids: appid, filters: 'basic' },
        }
    );

    const details = response.data[appid];
    if (!details || !details.success || !details.data) {
        throw new Error(`Game with App ID ${appid} not found or unavailable`);
    }

    const dlcIds: number[] = details.data.dlc || [];

    if (dlcIds.length === 0) {
        return {
            appid,
            name: details.data.name,
            dlc: [],
            count: 0
        };
    }

    // 2. Fetch names for the first 10 DLCs (to be efficient)
    // Steam public API doesn't support batching well for names
    const dlcResults: SteamDLC[] = [];
    const limit = Math.min(dlcIds.length, 10);

    for (let i = 0; i < limit; i++) {
        const dlcId = dlcIds[i];
        try {
            const dlcResponse = await axios.get<{ [key: string]: { success: boolean; data?: any } }>(
                STEAM_APP_DETAILS_URL,
                {
                    params: { appids: dlcId, filters: 'basic' },
                }
            );
            if (dlcResponse.data[dlcId]?.success) {
                dlcResults.push({
                    appid: dlcId,
                    name: dlcResponse.data[dlcId].data.name
                });
            }
        } catch (error) {
            console.error(`Failed to fetch details for DLC ${dlcId}:`, error);
        }
    }

    return {
        appid,
        name: details.data.name,
        dlc: dlcResults,
        total_dlc_count: dlcIds.length,
        retrieved_count: dlcResults.length,
        remaining_count: Math.max(0, dlcIds.length - limit)
    };
}

/**
 * Get a summary of user reviews for a specific Steam game
 */
export async function getSteamReviewsSummary(input: SteamReviewsSummaryInput): Promise<SteamReviewsSummary> {
    const { appid } = input;

    const response = await axios.get(`${STEAM_REVIEWS_URL}${appid}`, {
        params: {
            json: 1,
            language: 'all',
            num_per_page: 5,
            filter: 'all',
        },
    });

    const data = response.data;
    const summary = data.query_summary;

    if (!summary) {
        throw new Error(`Failed to retrieve review summary for App ID ${appid}`);
    }

    const percentageScore = summary.total_reviews > 0
        ? Math.round((summary.total_positive / summary.total_reviews) * 100)
        : 0;

    // Filter and clean review text for top reviews
    const topReviews = data.reviews
        .map((r: SteamReview) => r.review.trim())
        .filter((text: string) => text.length > 10) // Filter out very short reviews
        .slice(0, 5);

    return {
        appid,
        review_score: summary.review_score,
        review_score_desc: summary.review_score_desc,
        total_positive: summary.total_positive,
        total_negative: summary.total_negative,
        total_reviews: summary.total_reviews,
        percentage_score: percentageScore,
        top_reviews: topReviews,
    };
}

/**
 * Get the current global top selling games on Steam
 */
export async function getSteamTopSellers(input: { limit?: number }) {
    const { limit = 10 } = input;

    const response = await axios.get('https://store.steampowered.com/api/featuredcategories/');
    const data = response.data;

    if (!data.top_sellers || !data.top_sellers.items) {
        throw new Error('Failed to retrieve top sellers data from Steam');
    }

    const items = data.top_sellers.items.slice(0, limit).map((item: any) => ({
        appid: item.id,
        name: item.name,
        original_price: item.original_price,
        final_price: item.final_price,
        currency: item.currency,
        discount_percent: item.discount_percent,
        header_image: item.header_image,
    }));

    return {
        count: items.length,
        results: items,
    };
}

/**
 * Browse top games for a specific Steam category or genre
 */
export async function getSteamTopGames(input: SteamTopGamesInput) {
    const { genreId, limit = 10 } = input;

    // We use the storesearch API as it's the most reliable public way to find games by genre/keyword
    const response = await axios.get<SteamStoreSearchResponse>(STORE_SEARCH_URL, {
        params: {
            term: genreId || '',
            l: 'english',
            cc: 'US'
        }
    });

    const matches = response.data.items.slice(0, limit).map(item => ({
        appid: item.id,
        name: item.name,
        price: item.price,
        platforms: item.platforms,
    }));

    return {
        genre: genreId || 'All',
        count: matches.length,
        results: matches,
    };
}

/**
 * Get a list of common Steam genres and categories for discovery
 */
export async function getSteamGenres() {
    // Current curated list of standard Steam genres and tags
    const genres = [
        { id: 'Action', name: 'Action' },
        { id: 'RPG', name: 'RPG' },
        { id: 'Strategy', name: 'Strategy' },
        { id: 'Adventure', name: 'Adventure' },
        { id: 'Simulation', name: 'Simulation' },
        { id: 'Indie', name: 'Indie' },
        { id: 'Casual', name: 'Casual' },
        { id: 'Sports', name: 'Sports' },
        { id: 'Racing', name: 'Racing' },
        { id: 'Multiplayer', name: 'Multiplayer' },
        { id: 'Horror', name: 'Horror' },
        { id: 'Anime', name: 'Anime' },
        { id: 'Survival', name: 'Survival' },
        { id: 'Stealth', name: 'Stealth' }
    ];

    return {
        count: genres.length,
        genres
    };
}

/**
 * Get the latest news and announcements for a specific Steam game
 */
export async function getSteamGameNews(input: SteamNewsInput) {
    const { appid, count = 5 } = input;

    const response = await axios.get<{ appnews: SteamNewsResponse }>(STEAM_NEWS_URL, {
        params: {
            appid,
            count,
            maxlength: 300,
            format: 'json'
        },
    });

    const appnews = response.data.appnews;

    if (!appnews || !appnews.newsitems) {
        throw new Error(`Failed to retrieve news for App ID ${appid}`);
    }

    const newsItems = appnews.newsitems.map(item => ({
        gid: item.gid,
        title: item.title,
        url: item.url,
        author: item.author,
        contents: item.contents,
        feedlabel: item.feedlabel,
        date: new Date(item.date * 1000).toISOString(),
        feedname: item.feedname
    }));

    return {
        appid: appnews.appid,
        count: newsItems.length,
        news: newsItems
    };
}

/**
 * Get the current number of players online for a specific Steam game
 */
export async function getSteamPlayerCount(input: SteamPlayerCountInput) {
    const { appid } = input;

    const response = await axios.get<{ response: SteamPlayerCountResponse }>(STEAM_PLAYER_COUNT_URL, {
        params: {
            appid,
        },
    });

    const data = response.data.response;

    if (data.result !== 1) {
        throw new Error(`Failed to retrieve player count for App ID ${appid}`);
    }

    return {
        appid,
        player_count: data.player_count,
    };
}
