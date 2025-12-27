import { getSteamTopSellers, getSteamTopGames, getSteamGenres } from '../src/tools/steam.js';

async function testTopGames() {
    console.log('Testing Steam Top Games Explorer Tools...');

    // Test 1: Global Top Sellers
    try {
        console.log('\nFetching Global Top Sellers...');
        const result = await getSteamTopSellers({ limit: 5 });
        console.log(`Count: ${result.count}`);
        result.results.forEach((game: any, i: number) => {
            console.log(`${i + 1}. ${game.name} (${game.appid}) - Price: ${game.final_price / 100} ${game.currency}`);
        });
    } catch (error: any) {
        console.error('Top Sellers failed:', error.message);
    }

    // Test 2: Top Games by Genre (RPG)
    try {
        const genre = 'RPG';
        console.log(`\nFetching Top Games for genre: ${genre}...`);
        const result = await getSteamTopGames({ genreId: genre, limit: 5 });
        console.log(`Count: ${result.count}`);
        result.results.forEach((game: any, i: number) => {
            console.log(`${i + 1}. ${game.name} (${game.appid})`);
        });
    } catch (error: any) {
        console.error('Top Games failed:', error.message);
    }

    // Test 3: Top Games by Genre (Strategy)
    try {
        const genre = 'Strategy';
        console.log(`\nFetching Top Games for genre: ${genre}...`);
        const result = await getSteamTopGames({ genreId: genre, limit: 5 });
        console.log(`Count: ${result.count}`);
        result.results.forEach((game: any, i: number) => {
            console.log(`${i + 1}. ${game.name} (${game.appid})`);
        });
    } catch (error: any) {
        console.error('Top Games failed:', error.message);
    }

    // Test 4: Available Genres
    try {
        console.log('\nFetching Available Genres...');
        const result = await getSteamGenres();
        console.log(`Count: ${result.count}`);
        console.log('Genres:', result.genres.map(g => g.name).join(', '));
    } catch (error: any) {
        console.error('Genres failed:', error.message);
    }
}

testTopGames();
