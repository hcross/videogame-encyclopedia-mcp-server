# Agent Reference: Game Encyclopedia MCP Server

Technical reference for AI agents contributing to this project.

## Core Architecture
- **Framework**: Model Context Protocol (MCP) SDK.
- **Runtime**: Node.js (TypeScript).
- **APIs Used**:
  - **Steam Store API**: Public endpoints for search, details, DLCs, reviews, and top sellers. No API key required.
  - **SteamGridDB API**: Requires `STEAMGRIDDB_API_KEY` for visual assets (logos, heroes, grids, icons).

## Key Tool Implementation Patterns

### Keyless Steam Integrations
All Steam tools use public web endpoints to avoid the need for a Steam API Key:
- Search: `store.steampowered.com/api/storesearch/`
- Details: `store.steampowered.com/api/appdetails`
- Reviews: `store.steampowered.com/appreviews/`
- Featured: `store.steampowered.com/api/featuredcategories/`

### Asset Retrieval (SteamGridDB)
- Always map Steam App ID to SteamGridDB Game ID using `getSteamGridGameBySteamId` before fetching assets.
- Asset types are: `grid`, `hero`, `logo`, `icon`.

### Unified Tooling
The `game_get_full_profile` tool is the recommended entry point for LLMs. It handles the aggregation of Steam metadata and SteamGridDB assets in a single call.

## Development Workflow
- **Branching**: Use `feat-*` or `fix-*` branches for all changes.
- **Testing**: All tools must have a corresponding test script in `scripts/`.
- **Versioning**: Follow semantic versioning. Tags trigger automated NPM publishing.
