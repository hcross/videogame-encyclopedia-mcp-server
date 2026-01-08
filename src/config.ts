import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Config {
  steamGridDbApiKey: string;
  screenScraper?: {
    devId: string;
    devPassword: string;
    userId?: string;
    userPassword?: string;
    softwareName: string;
  };
}

export function loadConfig(): Config {
  const steamGridDbApiKey = process.env.STEAMGRIDDB_API_KEY;

  if (!steamGridDbApiKey) {
    throw new Error(
      "STEAMGRIDDB_API_KEY is not set. Please set it in your .env file or environment variables.",
    );
  }

  // ScreenScraper configuration is optional
  const screenScraperConfig =
    process.env.SCREENSCRAPER_DEV_ID && process.env.SCREENSCRAPER_DEV_PASSWORD
      ? {
          devId: process.env.SCREENSCRAPER_DEV_ID,
          devPassword: process.env.SCREENSCRAPER_DEV_PASSWORD,
          userId: process.env.SCREENSCRAPER_USER_ID,
          userPassword: process.env.SCREENSCRAPER_USER_PASSWORD,
          softwareName:
            process.env.SCREENSCRAPER_SOFTWARE_NAME ||
            "game-encyclopedia-mcp-server",
        }
      : undefined;

  return {
    steamGridDbApiKey,
    screenScraper: screenScraperConfig,
  };
}
