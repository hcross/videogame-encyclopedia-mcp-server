# Game Encyclopedia MCP Server

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

### SteamGridDB Integration
- **steamgrid_search_game**: Search for games on SteamGridDB
- **steamgrid_get_assets**: Retrieve visual assets including:
  - Transparent logos
  - Boxart/grid images
  - Hero/banner images
  - Icons
  - Multiple variations with metadata (dimensions, MIME type, author)

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
   - **Steam API Key**: Get from https://steamcommunity.com/dev/apikey
   - **SteamGridDB API Key**: Get from https://www.steamgriddb.com/profile/preferences/api

   ```env
   STEAM_API_KEY=your_steam_api_key_here
   STEAMGRIDDB_API_KEY=your_steamgriddb_api_key_here
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
        "STEAM_API_KEY": "your_steam_api_key_here",
        "STEAMGRIDDB_API_KEY": "your_steamgriddb_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop to load the server.

### With Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client. Run:

```bash
npm start
```

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

### 3. steamgrid_search_game

Search for games on SteamGridDB.

**Input:**
- `query` (string, required): Game name to search for

**Example:**
```json
{
  "query": "Elden Ring"
}
```

### 4. steamgrid_get_assets

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
│       └── steamgrid.ts   # SteamGridDB API integration
├── package.json
├── tsconfig.json
└── .env.example
```

## Troubleshooting

### "Configuration error" on startup

Make sure you've created a `.env` file with valid API keys:
- Check that `.env` exists in the project root
- Verify both `STEAM_API_KEY` and `STEAMGRIDDB_API_KEY` are set
- Ensure there are no quotes around the keys in the `.env` file

### "Game not found" errors

- For Steam: Verify the App ID is correct (use `steam_search_game` first)
- For SteamGridDB: Ensure the game ID is from SteamGridDB, not Steam

### No visual assets returned

Some games may not have all asset types available. The server returns only assets that exist in SteamGridDB.

## License

MIT
