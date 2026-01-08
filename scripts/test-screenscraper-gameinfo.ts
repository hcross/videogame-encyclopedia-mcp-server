import { getScreenScraperGameInfo } from '../src/tools/screenscraper.js';
import { loadConfig } from '../src/config.js';

async function testScreenScraperGameInfo() {
    console.log('Testing ScreenScraper Game Info Tool...');
    const config = loadConfig();

    // Test 1: Get game info by game ID (Super Mario Bros on NES - game ID may vary)
    try {
        console.log('\nFetching game info by name: "Super Mario Bros" on NES (System ID: 3)...');
        const gameInfo = await getScreenScraperGameInfo({
            gameName: 'Super Mario Bros',
            systemId: 3  // NES
        }, config);

        console.log('Success! Retrieved game information:');
        console.log(`- Game ID: ${gameInfo.id}`);
        console.log(`- Name: ${gameInfo.name}`);
        console.log(`- System: ${gameInfo.system.name}`);
        if (gameInfo.releasedate) console.log(`- Release Date: ${gameInfo.releasedate}`);
        if (gameInfo.developer) console.log(`- Developer: ${gameInfo.developer}`);
        if (gameInfo.publisher) console.log(`- Publisher: ${gameInfo.publisher}`);
        if (gameInfo.players) console.log(`- Players: ${gameInfo.players}`);
        if (gameInfo.rating) console.log(`- Rating: ${gameInfo.rating}/5`);
        if (gameInfo.genres.length > 0) {
            console.log(`- Genres: ${gameInfo.genres.join(', ')}`);
        }

        // Display synopsis
        if (gameInfo.synopsis && gameInfo.synopsis.length > 0) {
            const enSynopsis = gameInfo.synopsis.find(s => s.language === 'en');
            if (enSynopsis && enSynopsis.text) {
                const shortSynopsis = enSynopsis.text.substring(0, 150) + '...';
                console.log(`- Synopsis: ${shortSynopsis}`);
            }
        }

        // Display media counts
        console.log('\nMedia assets available:');
        if (gameInfo.media.screenshots) console.log(`- Screenshots: ${gameInfo.media.screenshots.length}`);
        if (gameInfo.media.covers) console.log(`- Covers: ${gameInfo.media.covers.length}`);
        if (gameInfo.media.wheels) console.log(`- Wheels: ${gameInfo.media.wheels.length}`);
        if (gameInfo.media.videos) console.log(`- Videos: ${gameInfo.media.videos.length}`);
        if (gameInfo.media.fanarts) console.log(`- Fanarts: ${gameInfo.media.fanarts.length}`);

        // Show first screenshot URL if available
        if (gameInfo.media.screenshots && gameInfo.media.screenshots.length > 0) {
            console.log(`\nFirst screenshot URL: ${gameInfo.media.screenshots[0].url}`);
        }
    } catch (error: any) {
        console.error('Super Mario Bros test failed:', error.message);
    }

    // Test 2: Get game info for Sonic the Hedgehog on Genesis
    try {
        console.log('\n\nFetching game info for "Sonic The Hedgehog" on Genesis (System ID: 1)...');
        const gameInfo = await getScreenScraperGameInfo({
            gameName: 'Sonic The Hedgehog',
            systemId: 1  // Genesis
        }, config);

        console.log('Success! Retrieved game information:');
        console.log(`- Name: ${gameInfo.name}`);
        console.log(`- System: ${gameInfo.system.name}`);
        if (gameInfo.developer) console.log(`- Developer: ${gameInfo.developer}`);
        if (gameInfo.genres.length > 0) console.log(`- Genres: ${gameInfo.genres.join(', ')}`);

        // Display cover art if available
        if (gameInfo.media.covers && gameInfo.media.covers.length > 0) {
            console.log(`\nCover art available (${gameInfo.media.covers.length} covers)`);
            console.log(`First cover URL: ${gameInfo.media.covers[0].url}`);
        }
    } catch (error: any) {
        console.error('Sonic test failed:', error.message);
    }

    // Test 3: Get game info for The Legend of Zelda on NES
    try {
        console.log('\n\nFetching game info for "The Legend of Zelda" on NES (System ID: 3)...');
        const gameInfo = await getScreenScraperGameInfo({
            gameName: 'The Legend of Zelda',
            systemId: 3
        }, config);

        console.log('Success! Retrieved game information:');
        console.log(`- Name: ${gameInfo.name}`);
        console.log(`- System: ${gameInfo.system.name}`);
        if (gameInfo.publisher) console.log(`- Publisher: ${gameInfo.publisher}`);
        if (gameInfo.players) console.log(`- Players: ${gameInfo.players}`);

        console.log('\nMedia summary:');
        const mediaTypes = ['screenshots', 'covers', 'wheels', 'marquees', 'videos', 'fanarts', 'boxes', 'cartridges', 'maps'];
        mediaTypes.forEach(type => {
            const count = (gameInfo.media as any)[type]?.length || 0;
            if (count > 0) {
                console.log(`- ${type}: ${count}`);
            }
        });
    } catch (error: any) {
        console.error('Zelda test failed:', error.message);
    }

    // Test 4: Test with non-existent game
    try {
        console.log('\n\nFetching game info for non-existent game...');
        await getScreenScraperGameInfo({
            gameName: 'ThisGameDoesNotExist12345XYZ',
            systemId: 3
        }, config);
    } catch (error: any) {
        console.log('Expected error caught:', error.message);
    }
}

testScreenScraperGameInfo();
