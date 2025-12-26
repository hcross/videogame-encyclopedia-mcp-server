import { getSteamDLCList } from '../src/tools/steam.js';

async function testSteamDLC() {
    console.log('Testing Steam DLC Explorer Tool (steam_get_dlc_list)...');

    // Test 1: Elden Ring (has 2 DLCs)
    try {
        const appid = 1245620;
        console.log(`\nFetching DLCs for Elden Ring (App ID: ${appid})...`);
        const result = await getSteamDLCList({ appid });

        console.log('Game Name:', result.name);
        console.log('Total DLCs:', result.total_dlc_count);
        console.log('Retrieved DLCs:', result.retrieved_count);

        result.dlc.forEach((dlc: any) => {
            console.log(`- [${dlc.appid}] ${dlc.name}`);
        });

        if (result.dlc.length > 0) {
            console.log('\nSuccess! DLCs retrieved correctly.');
        } else {
            console.log('\nNo DLCs found (as expected if game has none).');
        }
    } catch (error: any) {
        console.error('DLC list tool failed:', error.message);
    }

    // Test 2: A game with no DLC (e.g., a simple tool or indie game)
    try {
        const appid = 400; // Portal
        console.log(`\nFetching DLCs for Portal (App ID: ${appid})...`);
        const result = await getSteamDLCList({ appid });
        console.log('Total DLCs:', result.total_dlc_count);
    } catch (error: any) {
        console.error('Portal test failed:', error.message);
    }
}

testSteamDLC();
