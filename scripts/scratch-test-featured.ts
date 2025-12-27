import axios from 'axios';

async function testFeaturedCategories() {
    const url = 'https://store.steampowered.com/api/featuredcategories/';
    console.log(`GET ${url}`);
    try {
        const response = await axios.get(url);
        console.log('Categories:', Object.keys(response.data));
        // Check "top_sellers" if it exists
        if (response.data.top_sellers) {
            console.log('Top Sellers items count:', response.data.top_sellers.items.length);
            console.log('First top seller:', response.data.top_sellers.items[0].name);
        }
        // Check genres if they are listed
        if (response.data.genres) {
            console.log('Genres list:', Object.keys(response.data.genres));
        }
    } catch (error: any) {
        console.error('Failed:', error.message);
    }
}

testFeaturedCategories();
