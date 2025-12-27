import { getBestGameLogo } from '../src/tools/steamgrid.js';
import { loadConfig } from '../src/config.js';

async function testBestLogo() {
    console.log('Testing SteamGridDB Best Logo Tool...');
    const config = loadConfig();

    // Test 1: Elden Ring by Steam App ID (1245620)
    try {
        console.log('\nFetching best logo for Elden Ring (AppID: 1245620)...');
        const result = await getBestGameLogo({ appid: 1245620 }, config);
        console.log('Best Logo Found:');
        console.log(`- ID: ${result.logo.id}`);
        console.log(`- URL: ${result.logo.url}`);
        console.log(`- Style: ${result.logo.style}`);
        console.log(`- Score: ${result.logo.score}`);
        console.log(`- Upvotes: ${result.logo.upvotes}`);
        console.log(`- Author: ${result.logo.author}`);
    } catch (error: any) {
        console.error('Elden Ring test failed:', error.message);
    }

    // Test 2: Control by SteamGridDB Game ID (32044)
    try {
        console.log('\nFetching best logo for Control (GameID: 32044)...');
        const result = await getBestGameLogo({ gameId: 32044 }, config);
        console.log('Best Logo Found:');
        console.log(`- ID: ${result.logo.id}`);
        console.log(`- URL: ${result.logo.url}`);
        console.log(`- Style: ${result.logo.style}`);
        console.log(`- Score: ${result.logo.score}`);
        console.log(`- Upvotes: ${result.logo.upvotes}`);
        console.log(`- Author: ${result.logo.author}`);
    } catch (error: any) {
        console.error('Control test failed:', error.message);
    }

    // Test 3: Invalid App ID
    try {
        console.log('\nFetching best logo for Invalid App ID (999999999)...');
        await getBestGameLogo({ appid: 999999999 }, config);
    } catch (error: any) {
        console.log('Expected error caught:', error.message);
    }
}

testBestLogo();
