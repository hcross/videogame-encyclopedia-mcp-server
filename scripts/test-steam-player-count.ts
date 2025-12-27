import { getSteamPlayerCount } from '../src/tools/steam.js';

async function testPlayerCount() {
    console.log('Testing Steam Live Player Count Tool...');

    // Test 1: Elden Ring (1245620)
    try {
        console.log('\nFetching player count for Elden Ring (1245620)...');
        const result = await getSteamPlayerCount({ appid: 1245620 });
        console.log(`Current Players online: ${result.player_count.toLocaleString()}`);
    } catch (error: any) {
        console.error('Elden Ring test failed:', error.message);
    }

    // Test 2: CS2 (730) - Always has high player count
    try {
        console.log('\nFetching player count for CS2 (730)...');
        const result = await getSteamPlayerCount({ appid: 730 });
        console.log(`Current Players online: ${result.player_count.toLocaleString()}`);
    } catch (error: any) {
        console.error('CS2 test failed:', error.message);
    }

    // Test 3: Invalid App ID
    try {
        console.log('\nFetching player count for Invalid App ID (999999999)...');
        const result = await getSteamPlayerCount({ appid: 999999999 });
        console.log(`Player count: ${result.player_count}`);
    } catch (error: any) {
        console.log('Expected error caught:', error.message);
    }
}

testPlayerCount();
