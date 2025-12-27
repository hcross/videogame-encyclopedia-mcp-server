import { getSteamReviewsSummary } from '../src/tools/steam.js';

async function testSteamReviews() {
    console.log('Testing Steam Reviews Summary Tool (steam_get_reviews_summary)...');

    // Test 1: Elden Ring (Very popular)
    try {
        const appid = 1245620;
        console.log(`\nFetching reviews for Elden Ring (App ID: ${appid})...`);
        const result = await getSteamReviewsSummary({ appid });

        console.log('Review Score Desc:', result.review_score_desc);
        console.log('Percentage Score:', result.percentage_score + '%');
        console.log('Total Reviews:', result.total_reviews);
        console.log('Positive Reviews:', result.total_positive);
        console.log('Top Review Snippets:', result.top_reviews.length);

        result.top_reviews.forEach((review: string, i: number) => {
            console.log(`\nReview ${i + 1}:`);
            console.log(review.substring(0, 150) + (review.length > 150 ? '...' : ''));
        });

        if (result.total_reviews > 0) {
            console.log('\nSuccess! Reviews summary retrieved correctly.');
        }
    } catch (error: any) {
        console.error('Reviews summary tool failed:', error.message);
    }

    // Test 2: A niche or specific game
    try {
        const appid = 400; // Portal
        console.log(`\nFetching reviews for Portal (App ID: ${appid})...`);
        const result = await getSteamReviewsSummary({ appid });
        console.log('Review Score Desc:', result.review_score_desc);
        console.log('Percentage Score:', result.percentage_score + '%');
    } catch (error: any) {
        console.error('Portal test failed:', error.message);
    }
}

testSteamReviews();
