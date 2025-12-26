import { searchSteamGames, getSteamGameDetails } from './steam.js';
import { getSteamGridGameBySteamId, getSteamGridAssets } from './steamgrid.js';
import type { UnifiedSearchInput, UnifiedGameProfile } from '../types.js';
import type { Config } from '../config.js';

/**
 * Get a full game profile aggregating metadata from Steam and assets from SteamGridDB
 */
export async function getFullGameProfile(
    input: UnifiedSearchInput,
    config: Config
): Promise<UnifiedGameProfile> {
    const { query } = input;

    // 1. Search Steam for the game to get the appid
    const searchResults = await searchSteamGames({ query, limit: 1 });
    if (searchResults.count === 0) {
        throw new Error(`Game '${query}' not found on Steam.`);
    }

    const appid = searchResults.results[0].appid;

    // 2. Fetch full Steam details
    const steamDetails = await getSteamGameDetails({ appid });

    // 3. Find SteamGridDB game by Steam ID
    const sgdbGame = await getSteamGridGameBySteamId(appid, config);

    let assets: UnifiedGameProfile['assets'] = {
        header_image: steamDetails.header_image,
    };

    // 4. If found on SteamGridDB, fetch top assets
    if (sgdbGame) {
        const sgdbAssets = await getSteamGridAssets(
            { gameId: sgdbGame.id, assetTypes: ['hero', 'logo', 'grid', 'icon'] },
            config
        );

        assets = {
            ...assets,
            hero: sgdbAssets.assets.hero?.[0]?.url,
            logo: sgdbAssets.assets.logo?.[0]?.url,
            grid: sgdbAssets.assets.grid?.[0]?.url,
            icon: sgdbAssets.assets.icon?.[0]?.url,
        };
    }

    // 5. Build unified profile
    return {
        metadata: {
            appid: steamDetails.appid,
            name: steamDetails.name,
            type: steamDetails.type,
            short_description: steamDetails.description,
            developers: steamDetails.developers,
            publishers: steamDetails.publishers,
            release_date: steamDetails.release_date.date,
            genres: steamDetails.genres,
            categories: steamDetails.categories,
            price: steamDetails.price?.final_formatted,
            website: steamDetails.website,
        },
        assets,
    };
}
