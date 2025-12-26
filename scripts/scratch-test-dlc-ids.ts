import axios from 'axios';

async function testDLCList() {
    const appid = 1245620; // Elden Ring
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`;
    console.log(`GET ${url}`);
    const response = await axios.get(url);
    const data = response.data[appid].data;
    console.log('DLC IDs:', data.dlc);
}

testDLCList();
