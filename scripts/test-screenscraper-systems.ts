import { getScreenScraperSystems } from '../src/tools/screenscraper.js';
import { loadConfig } from '../src/config.js';

async function testScreenScraperSystems() {
    console.log('Testing ScreenScraper Systems List Tool...');
    const config = loadConfig();

    try {
        console.log('\nFetching list of supported systems from ScreenScraper...');
        const systems = await getScreenScraperSystems(config);
        console.log(`Success! Retrieved ${systems.length} gaming systems.`);

        // Display first few systems
        console.log('\nFirst 10 systems:');
        systems.slice(0, 10).forEach(system => {
            console.log(`- ID: ${system.id} | Name: ${system.name} | Manufacturer: ${system.manufacturer}`);
            if (system.extensions) {
                console.log(`  Extensions: ${system.extensions}`);
            }
        });

        // Display some popular systems
        const popularSystemNames = ['Super Nintendo (SNES)', 'Nintendo Entertainment System (NES)', 'PlayStation', 'Sega Genesis', 'Game Boy'];
        console.log('\nLooking for popular systems:');
        popularSystemNames.forEach(name => {
            const system = systems.find(s => s.name.includes(name.split('(')[0].trim()));
            if (system) {
                console.log(`- ${system.name} (ID: ${system.id})`);
            }
        });

    } catch (error: any) {
        console.error('ScreenScraper Systems test failed:', error.message);
    }
}

testScreenScraperSystems();
