import axios from 'axios';

async function testBatchAppDetails() {
    const appids = [1245620, 1774580]; // Elden Ring and one of its DLCs
    const url = `https://store.steampowered.com/api/appdetails?appids=${appids.join(',')}&filters=basic`;
    console.log(`GET ${url}`);
    const response = await axios.get(url);
    console.log(JSON.stringify(response.data, null, 2));
}

testBatchAppDetails();
