# Videogame Encyclopedia MCP Server

A Model Context Protocol (MCP) server that provides structured video game information from Steam and SteamGridDB. This server exposes tools for searching games and retrieving comprehensive metadata including descriptions, categories, release dates, player counts, and visual assets like logos, boxart, and icons.

## Features

### Steam Integration
- **steam_search_game**: Search for games by name on Steam
- **steam_get_details**: Get comprehensive game information including:
  - Description and detailed information
  - Categories and genres
  - Supported platforms (Windows, Mac, Linux)
  - Multiplayer/singleplayer capabilities
  - Release date
  - Pricing information
  - Developer and publisher details
- **steam_get_dlc_list**: List all available DLCs for a specific game
- **steam_get_reviews_summary**: Get community ratings and top review snippets
- **steam_get_top_sellers**: Get current global top selling games
- **steam_get_top_games**: Browse top games by genre or category
- **steam_get_genres**: Get a list of common Steam genres for discovery

### SteamGridDB Integration
- **steamgrid_search_game**: Search for games on SteamGridDB
- **steamgrid_get_assets**: Retrieve visual assets including:
  - Transparent logos
  - Boxart/grid images
  - Hero/banner images
  - Icons
  - Multiple variations with metadata (dimensions, MIME type, author)

### Unified Tools
- **game_get_full_profile**: Get a comprehensive game profile in a single request, aggregating metadata from Steam and community visual assets from SteamGridDB. This is the **recommended tool** for providing a complete overview of a game.

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

1. **Clone or download this repository**
   ```bash
   cd /Users/hoanicross/devel/perso/genai/mcp/game-encyclopedia-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API keys**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   - **SteamGridDB API Key**: Required for high-quality game assets (grids, heroes, logos). Get it at [steamgriddb.com](https://www.steamgriddb.com/profile/api).

## Configuration

The server requires the following environment variables:

| Variable | Description |
|----------|-------------|
| `STEAMGRIDDB_API_KEY` | Your SteamGridDB API key |

## Setup

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
STEAMGRIDDB_API_KEY=your_steamgriddb_key_here
```

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### With Claude Desktop

Add this server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "game-encyclopedia": {
      "command": "node",
      "args": ["/Users/hoanicross/devel/perso/genai/mcp/game-encyclopedia-mcp-server/dist/index.js"],
      "env": {
        "STEAMGRIDDB_API_KEY": "your_steamgriddb_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop to load the server.

### Quick Installation/Launch

#### Via Smithery
You can install this server into your MCP client (like Claude Desktop) with one command:
```bash
npx -y @smithery/cli@latest install videogame-encyclopedia-mcp-server --client claude
```

#### Via uvx
If you have `uv` installed, you can run the server directly (requires Node.js locally):
```bash
uvx --from node videogame-encyclopedia-mcp-server
```

#### Via npx
```bash
npx videogame-encyclopedia-mcp-server
```

> [!NOTE]
> To publish this package to NPM, you must set an `NPM_TOKEN` secret in your GitHub repository settings.

## Available Tools

### 1. steam_search_game

Search for games on Steam by name.

**Input:**
- `query` (string, required): Game name to search for
- `limit` (number, optional): Maximum results (default: 10)

**Example:**
```json
{
  "query": "Elden Ring",
  "limit": 5
}
```

### 2. steam_get_details

Get detailed information about a Steam game.

**Input:**
- `appid` (number, required): Steam App ID

**Example:**
```json
{
  "appid": 1245620
}
```

### 3. steam_get_dlc_list

Get a list of all available DLCs for a specific Steam game.

**Input:**
- `appid` (number, required): Steam App ID

**Example:**
```json
{
  "appid": 1245620
}
```

### 4. steam_get_reviews_summary

Get a summary of user reviews and ratings for a specific Steam game.

**Input:**
- `appid` (number, required): Steam App ID

**Example:**
```json
{
  "appid": 1245620
}
```

### 5. steam_get_genres

Get a list of common Steam genres and categories for discovery.

**Example:**
```json
{}
```

### 6. steam_get_top_sellers

Get the current global top selling games on Steam.

**Input:**
- `limit` (number, optional): Maximum results (default: 10)

**Example:**
```json
{
  "limit": 5
}
```

### 7. steam_get_top_games

Browse top games for a specific Steam category or genre (e.g., "Action", "RPG", "Strategy").

**Input:**
- `genreId` (string, optional): Genre name to browse
- `limit` (number, optional): Maximum results (default: 10)

**Example:**
```json
{
  "genreId": "RPG",
  "limit": 5
}
```

### 8. steamgrid_search_game

Search for games on SteamGridDB.

**Input:**
- `query` (string, required): Game name to search for

**Example:**
```json
{
  "query": "Elden Ring"
}
```

### 9. steamgrid_get_assets

Get visual assets for a game from SteamGridDB.

**Input:**
- `gameId` (number, required): SteamGridDB game ID
- `assetTypes` (array, optional): Asset types to retrieve: `grid`, `hero`, `logo`, `icon` (default: all)

**Example:**
```json
{
  "gameId": 123456,
  "assetTypes": ["logo", "grid"]
}
```

### 10. game_get_full_profile

Get a comprehensive game profile combining metadata from Steam and visual assets from SteamGridDB. This tool automatically handles the mapping between Steam and SteamGridDB.

**Input:**
- `query` (string, required): Game name to search for

**Example:**
```json
{
  "query": "Elden Ring"
}
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Build and run in one command

### Project Structure

```
game-encyclopedia-mcp-server/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── config.ts          # Configuration management
│   ├── types.ts           # TypeScript type definitions
│   └── tools/
│       ├── steam.ts       # Steam API integration
│       ├── steamgrid.ts   # SteamGridDB API integration
│       └── unified.ts     # Unified search tool implementation
├── package.json
├── tsconfig.json
└── .env.example
```

## Troubleshooting

### "Configuration error" on startup

Make sure you've created a `.env` file with valid API keys:
- Check that `.env` exists in the project root
- Verify `STEAMGRIDDB_API_KEY` is set
- Ensure there are no quotes around the keys in the `.env` file

### "Game not found" errors

- For SteamGridDB: Ensure the game ID is from SteamGridDB, not Steam

### No visual assets returned

Some games may not have all asset types available. The server returns only assets that exist in SteamGridDB.

## License

MIT
