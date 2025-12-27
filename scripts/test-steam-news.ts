import { getSteamGameNews } from '../src/tools/steam.js';

async function testSteamNews() {
    console.log('Testing Steam News Integration Tool...');

    // Test 1: Elden Ring (1245620)
    try {
        console.log('\nFetching news for Elden Ring (1245620)...');
        const result = await getSteamGameNews({ appid: 1245620, count: 3 });
        console.log(`Retrieved ${result.count} news items.`);

        result.news.forEach((item, index) => {
            console.log(`\n--- News Item ${index + 1} ---`);
            console.log(`Title: ${item.title}`);
            console.log(`Author: ${item.author}`);
            console.log(`Date: ${item.date}`);
            console.log(`URL: ${item.url}`);
        });
    } catch (error: any) {
        console.error('Elden Ring news test failed:', error.message);
    }

    // Test 2: Invalid App ID
    try {
        console.log('\nFetching news for Invalid App ID (999999999)...');
        const result = await getSteamGameNews({ appid: 999999999 });
        console.log(`Retrieved ${result.count} news items.`);
    } catch (error: any) {
        console.log('Expected error caught:', error.message);
    }
}

testSteamNews();
