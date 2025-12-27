import axios from 'axios';

async function testSteamReviewsAPI() {
    const appid = 1245620; // Elden Ring
    const url = `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&num_per_page=3&filter=all`;
    console.log(`GET ${url}`);
    try {
        const response = await axios.get(url);
        console.log('Summary:', JSON.stringify(response.data.query_summary, null, 2));
        console.log('Reviews count:', response.data.reviews.length);
        if (response.data.reviews.length > 0) {
            console.log('First Review Snippet:', response.data.reviews[0].review.substring(0, 100));
        }
    } catch (error: any) {
        console.error('API failed:', error.message);
    }
}

testSteamReviewsAPI();
