import { searchSteamGames, getSteamGameDetails } from '../src/tools/steam.js';
import { loadConfig } from '../src/config.js';

async function testSteamAPI() {
    console.log('Testing Public Steam Store Search API via tool function...');
    try {
        const result = await searchSteamGames({ query: 'Elden Ring', limit: 5 });
        console.log('Success! Received results.');
        console.log(`Match count: ${result.count}`);
        if (result.results.length > 0) {
            console.log('First result:', result.results[0]);
        }
    } catch (error: any) {
        console.error('Search tool failed:', error.message);
    }

    console.log('\nTesting Steam App Details API (Elden Ring - 1245620)...');
    try {
        // config still loaded for SteamGridDB if needed, but not passed to Steam details anymore
        const result = await getSteamGameDetails({ appid: 1245620 });
        console.log('Success! Received app details.');
        console.log('Name:', result.name);
        console.log('Developers:', result.developers.join(', '));
    } catch (error: any) {
        console.error('Details tool failed:', error.message);
    }
}

testSteamAPI();
