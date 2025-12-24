import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
    steamApiKey: string;
    steamGridDbApiKey: string;
}

export function loadConfig(): Config {
    const steamApiKey = process.env.STEAM_API_KEY;
    const steamGridDbApiKey = process.env.STEAMGRIDDB_API_KEY;

    if (!steamApiKey) {
        throw new Error(
            'STEAM_API_KEY is not set. Please set it in your .env file or environment variables.'
        );
    }

    if (!steamGridDbApiKey) {
        throw new Error(
            'STEAMGRIDDB_API_KEY is not set. Please set it in your .env file or environment variables.'
        );
    }

    return {
        steamApiKey,
        steamGridDbApiKey,
    };
}
