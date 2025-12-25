import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
    steamGridDbApiKey: string;
}

export function loadConfig(): Config {
    const steamGridDbApiKey = process.env.STEAMGRIDDB_API_KEY;

    if (!steamGridDbApiKey) {
        throw new Error(
            'STEAMGRIDDB_API_KEY is not set. Please set it in your .env file or environment variables.'
        );
    }

    return {
        steamGridDbApiKey,
    };
}
