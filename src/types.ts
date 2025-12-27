/**
 * Type definitions for Steam and SteamGridDB API responses
 */

// Steam API Types
export interface SteamApp {
    appid: number;
    name: string;
}

export interface SteamStoreSearchResponse {
    total: number;
    items: {
        id: number;
        name: string;
        price?: {
            currency: string;
            initial: number;
            final: number;
        };
        platforms?: {
            windows: boolean;
            mac: boolean;
            linux: boolean;
        };
    }[];
}

export interface SteamAppDetails {
    steam_appid: number;
    name: string;
    type: string;
    short_description: string;
    detailed_description: string;
    about_the_game: string;
    header_image: string;
    capsule_image: string;
    website: string;
    developers?: string[];
    publishers?: string[];
    price_overview?: {
        currency: string;
        initial: number;
        final: number;
        final_formatted: string;
    };
    platforms: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    categories?: { id: number; description: string }[];
    genres?: { id: string; description: string }[];
    release_date: {
        coming_soon: boolean;
        date: string;
    };
    is_free: boolean;
    supported_languages: string;
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

export interface SteamDLCListInput {
    appid: number;
}

export interface SteamDLC {
    appid: number;
    name: string;
}

export interface SteamReviewsSummaryInput {
    appid: number;
}

export interface SteamReview {
    recommendationid: string;
    review: string;
    voted_up: boolean;
    votes_up: number;
    weighted_vote_score: string;
}

export interface SteamReviewsSummary {
    appid: number;
    review_score: number;
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
    percentage_score: number;
    top_reviews: string[];
}
// Unified Tool Types
export interface UnifiedSearchInput {
    query: string;
}

export interface UnifiedGameProfile {
    metadata: {
        appid: number;
        name: string;
        type: string;
        short_description: string;
        developers: string[];
        publishers: string[];
        release_date: string;
        genres: string[];
        categories: string[];
        price?: string;
        website?: string;
    };
    assets: {
        header_image?: string; // From Steam
        hero?: string;        // From SteamGridDB
        logo?: string;        // From SteamGridDB
        icon?: string;        // From SteamGridDB
        grid?: string;        // From SteamGridDB
    };
}
