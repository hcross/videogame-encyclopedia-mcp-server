import { searchScreenScraperGames } from '../src/tools/screenscraper.js';
import { loadConfig } from '../src/config.js';

async function testScreenScraperSearch() {
    console.log('Testing ScreenScraper Game Search Tool...');
    const config = loadConfig();

    // Test 1: Search for Super Mario Bros (general search)
    try {
        console.log('\nSearching for "Super Mario Bros"...');
        const results = await searchScreenScraperGames({ gameName: 'Super Mario Bros' }, config);
        console.log(`Success! Found ${results.length} results.`);

        if (results.length > 0) {
            console.log('\nFirst 5 results:');
            results.slice(0, 5).forEach((game, index) => {
                console.log(`${index + 1}. ${game.name}`);
                console.log(`   System: ${game.system.name} (ID: ${game.system.id})`);
                if (game.releasedate) console.log(`   Release: ${game.releasedate}`);
                if (game.developer) console.log(`   Developer: ${game.developer}`);
                if (game.publisher) console.log(`   Publisher: ${game.publisher}`);
                console.log('');
            });
        }
    } catch (error: any) {
        console.error('Super Mario Bros search failed:', error.message);
    }

    // Test 2: Search with system filter - Sonic on Sega Genesis (systemId: 1)
    try {
        console.log('\nSearching for "Sonic" on Sega Genesis (System ID: 1)...');
        const results = await searchScreenScraperGames({
            gameName: 'Sonic',
            systemId: 1
        }, config);
        console.log(`Success! Found ${results.length} Sonic games on Genesis.`);

        if (results.length > 0) {
            console.log('\nResults:');
            results.slice(0, 5).forEach((game, index) => {
                console.log(`${index + 1}. ${game.name} - ${game.system.name}`);
                if (game.genres.length > 0) {
                    console.log(`   Genres: ${game.genres.join(', ')}`);
                }
            });
        }
    } catch (error: any) {
        console.error('Sonic search failed:', error.message);
    }

    // Test 3: Search for The Legend of Zelda
    try {
        console.log('\nSearching for "The Legend of Zelda"...');
        const results = await searchScreenScraperGames({ gameName: 'The Legend of Zelda' }, config);
        console.log(`Success! Found ${results.length} Zelda games.`);

        if (results.length > 0) {
            console.log('\nShowing systems found:');
            const systems = new Set(results.map(g => g.system.name));
            systems.forEach(system => console.log(`- ${system}`));
        }
    } catch (error: any) {
        console.error('Zelda search failed:', error.message);
    }

    // Test 4: Search with no results
    try {
        console.log('\nSearching for "NonexistentGame12345XYZ"...');
        const results = await searchScreenScraperGames({ gameName: 'NonexistentGame12345XYZ' }, config);
        console.log(`Returned ${results.length} results (expected 0).`);
    } catch (error: any) {
        console.log('Expected behavior - no results found:', error.message);
    }
}

testScreenScraperSearch();
