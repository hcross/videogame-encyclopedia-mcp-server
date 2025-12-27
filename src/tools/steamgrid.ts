import axios from 'axios';
import type { Config } from '../config.js';
import type {
    SteamGridSearchResponse,
    SteamGridAssetsResponse,
    SteamGridSearchInput,
    SteamGridAssetsInput,
    SteamGridBestLogoInput,
    SteamGridGame,
    SteamGridLogoAsset,
} from '../types.js';

const STEAMGRID_BASE_URL = 'https://www.steamgriddb.com/api/v2';

/**
 * Search for games on SteamGridDB
 */
export async function searchSteamGridGames(
    input: SteamGridSearchInput,
    config: Config
) {
    const { query } = input;

    const response = await axios.get<SteamGridSearchResponse>(
        `${STEAMGRID_BASE_URL}/search/autocomplete/${encodeURIComponent(query)}`,
        {
            headers: {
                Authorization: `Bearer ${config.steamGridDbApiKey}`,
            },
        }
    );

    if (!response.data.success) {
        throw new Error('Failed to search SteamGridDB');
    }

    return {
        results: response.data.data.map((game) => ({
            id: game.id,
            name: game.name,
            types: game.types,
            verified: game.verified,
        })),
        count: response.data.data.length,
    };
}

/**
 * Get visual assets for a game from SteamGridDB
 */
export async function getSteamGridAssets(
    input: SteamGridAssetsInput,
    config: Config
) {
    const { gameId, assetTypes = ['grid', 'hero', 'logo', 'icon'] } = input;

    const assets: {
        [key: string]: Array<{
            id: number;
            url: string;
            thumb: string;
            width: number;
            height: number;
            mime: string;
            author: string;
        }>;
    } = {};

    // Fetch each asset type
    for (const assetType of assetTypes) {
        try {
            const pluralType = assetType === 'hero' ? 'heroes' : `${assetType}s`;
            const endpoint = `${STEAMGRID_BASE_URL}/${pluralType}/game/${gameId}`;
            const response = await axios.get<SteamGridAssetsResponse>(endpoint, {
                headers: {
                    Authorization: `Bearer ${config.steamGridDbApiKey}`,
                },
            });

            if (response.data.success && response.data.data.length > 0) {
                assets[assetType] = response.data.data.map((asset) => ({
                    id: asset.id,
                    url: asset.url,
                    thumb: asset.thumb,
                    width: asset.width,
                    height: asset.height,
                    mime: asset.mime,
                    author: asset.author.name,
                }));
            }
        } catch (error) {
            // If a specific asset type fails, continue with others
            console.error(`Failed to fetch ${assetType} for game ${gameId}:`, error);
        }
    }

    return {
        gameId,
        assets,
    };
}

/**
 * Find a SteamGridDB game by its Steam App ID
 */
export async function getSteamGridGameBySteamId(
    steamId: number,
    config: Config
) {
    try {
        const response = await axios.get<{
            success: boolean;
            data: SteamGridGame;
        }>(`${STEAMGRID_BASE_URL}/games/steam/${steamId}`, {
            headers: {
                Authorization: `Bearer ${config.steamGridDbApiKey}`,
            },
        });

        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error(`Failed to find SteamGridDB game for Steam ID ${steamId}:`, error);
        return null;
    }
}

/**
 * Get the best transparent logo for a game from SteamGridDB
 */
export async function getBestGameLogo(
    input: SteamGridBestLogoInput,
    config: Config
) {
    let { gameId, appid } = input;

    // 1. Resolve gameId if appid is provided
    if (!gameId && appid) {
        const game = await getSteamGridGameBySteamId(appid, config);
        if (game) {
            gameId = game.id;
        }
    }

    if (!gameId) {
        throw new Error('Valid Game ID or Steam App ID required');
    }

    // 2. Fetch logos
    const response = await axios.get<{ success: boolean; data: SteamGridLogoAsset[] }>(
        `${STEAMGRID_BASE_URL}/logos/game/${gameId}`,
        {
            headers: {
                Authorization: `Bearer ${config.steamGridDbApiKey}`,
            },
        }
    );

    if (!response.data.success || response.data.data.length === 0) {
        throw new Error(`No logos found for game ${gameId}`);
    }

    // 3. Filter and Sort
    const logos = response.data.data;

    // Sorting strategy:
    // 1. style: 'official'
    // 2. score (desc)
    // 3. upvotes (desc)
    const sortedLogos = logos.sort((a, b) => {
        // Official style priority
        if (a.style === 'official' && b.style !== 'official') return -1;
        if (a.style !== 'official' && b.style === 'official') return 1;

        // Score priority
        if (b.score !== a.score) return b.score - a.score;

        // Upvotes priority
        return b.upvotes - a.upvotes;
    });

    const bestLogo = sortedLogos[0];

    return {
        gameId,
        appid,
        logo: {
            id: bestLogo.id,
            url: bestLogo.url,
            style: bestLogo.style,
            score: bestLogo.score,
            upvotes: bestLogo.upvotes,
            author: bestLogo.author.name
        }
    };
}
