import { getFullGameProfile } from '../src/tools/unified.js';
import { loadConfig } from '../src/config.js';

async function testUnifiedSearch() {
    console.log('Testing Unified Game Search Tool (game_get_full_profile)...');
    try {
        const config = loadConfig();
        const query = 'Elden Ring';
        console.log(`Searching for: ${query}`);

        const result = await getFullGameProfile({ query }, config);

        console.log('\n--- Metadata ---');
        console.log('App ID:', result.metadata.appid);
        console.log('Name:', result.metadata.name);
        console.log('Developers:', result.metadata.developers.join(', '));
        console.log('Release Date:', result.metadata.release_date);
        console.log('Price:', result.metadata.price);

        console.log('\n--- Assets ---');
        console.log('Steam Header:', result.assets.header_image);
        console.log('SGDB Hero:', result.assets.hero);
        console.log('SGDB Logo:', result.assets.logo);
        console.log('SGDB Icon:', result.assets.icon);
        console.log('SGDB Grid:', result.assets.grid);

        console.log('\nSuccess! Unified profile retrieved.');
    } catch (error: any) {
        console.error('Unified search failed:', error.message);
        if (error.stack) {
            // console.error(error.stack);
        }
    }
}

testUnifiedSearch();
