import axios from 'axios';

async function testDLCBatch() {
    const dlcIds = [2778590, 2778580]; // Elden Ring DLC IDs from previous test
    const url = `https://store.steampowered.com/api/appdetails?appids=${dlcIds.join(',')}&filters=basic`;
    console.log(`GET ${url}`);
    try {
        const response = await axios.get(url);
        console.log('Response state:', response.status);
        console.log('Results:');
        for (const id of dlcIds) {
            console.log(`ID ${id}: success=${response.data[id]?.success}, name=${response.data[id]?.data?.name}`);
        }
    } catch (error: any) {
        console.error('Batch failed:', error.message);
    }
}

testDLCBatch();
