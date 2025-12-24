import axios from 'axios';
import type { Config } from '../config.js';
import type {
    SteamGridSearchResponse,
    SteamGridAssetsResponse,
    SteamGridSearchInput,
    SteamGridAssetsInput,
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
            const endpoint = `${STEAMGRID_BASE_URL}/${assetType}s/game/${gameId}`;
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
