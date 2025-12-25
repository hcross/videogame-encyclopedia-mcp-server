import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testPublicSteamSearch() {
    console.log('Testing Public Steam Store Search API...');

    // Test 1: storesearch (official-ish public search)
    try {
        const query = 'Elden Ring';
        const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;
        console.log(`\nGET ${url}`);
        const response = await axios.get(url);

        if (response.data && response.data.total > 0) {
            console.log(`Success! Found ${response.data.total} results.`);
            const firstResult = response.data.items[0];
            console.log('First result:', {
                id: firstResult.id,
                name: firstResult.name,
                price: firstResult.price
            });
        } else {
            console.log('No results found via storesearch.');
        }
    } catch (error: any) {
        console.error('Storesearch failed:', error.message);
    }

    // Test 2: search-suggestion (faster, used for autocomplete)
    try {
        const query = 'Elden';
        const url = `https://store.steampowered.com/api/search-suggestion/?term=${encodeURIComponent(query)}`;
        console.log(`\nGET ${url}`);
        const response = await axios.get(url);

        if (response.data) {
            console.log('Success! Received search suggestions.');
            console.log('Suggestions:', response.data.substring(0, 500) + '...');
        }
    } catch (error: any) {
        console.error('Search-suggestion failed:', error.message);
    }
}

testPublicSteamSearch();
