import axios from 'axios';

async function testDLCListFull() {
    const appid = 1245620; // Elden Ring
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`; // No filter
    console.log(`GET ${url}`);
    const response = await axios.get(url);
    const data = response.data[appid].data;
    console.log('DLC Data:', JSON.stringify(data.dlc, null, 2));
}

testDLCListFull();
