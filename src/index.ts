#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { searchSteamGames, getSteamGameDetails, getSteamDLCList, getSteamReviewsSummary, getSteamTopSellers, getSteamTopGames, getSteamGenres, getSteamGameNews } from './tools/steam.js';
import { searchSteamGridGames, getSteamGridAssets } from './tools/steamgrid.js';
import { getFullGameProfile } from './tools/unified.js';

// Load configuration
let config;
try {
    config = loadConfig();
} catch (error) {
    console.error('Configuration error:', error);
    process.exit(1);
}

// Create MCP server
const server = new Server(
    {
        name: 'game-encyclopedia-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'steam_search_game',
                description:
                    'Search for video games on Steam by name. Returns a list of matching games with their App IDs.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The game name to search for',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results to return (default: 10)',
                            default: 10,
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'steam_get_details',
                description:
                    'Get detailed information about a Steam game by its App ID. Returns comprehensive metadata including description, categories, genres, supported players, release date, price, and more.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        appid: {
                            type: 'number',
                            description: 'The Steam App ID of the game',
                        },
                    },
                    required: ['appid'],
                },
            },
            {
                name: 'steamgrid_search_game',
                description:
                    'Search for video games on SteamGridDB by name. Returns a list of matching games with their SteamGridDB IDs, which can be used to retrieve visual assets.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The game name to search for',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'steamgrid_get_assets',
                description:
                    'Get visual assets for a game from SteamGridDB. Returns URLs for various asset types including transparent logos, boxart/grids, hero images, and icons.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        gameId: {
                            type: 'number',
                            description: 'The SteamGridDB game ID',
                        },
                        assetTypes: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['grid', 'hero', 'logo', 'icon'],
                            },
                            description:
                                'Types of assets to retrieve (default: all types)',
                            default: ['grid', 'hero', 'logo', 'icon'],
                        },
                    },
                    required: ['gameId'],
                },
            },
            {
                name: 'steam_get_dlc_list',
                description:
                    'Get a list of all available DLCs for a specific Steam game by its App ID. Returns the App ID and name for each DLC.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        appid: {
                            type: 'number',
                            description: 'The Steam App ID of the main game',
                        },
                    },
                    required: ['appid'],
                },
            },
            {
                name: 'steam_get_reviews_summary',
                description:
                    'Get a summary of user reviews and ratings for a specific Steam game by its App ID. Includes overall score and top review snippets.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        appid: {
                            type: 'number',
                            description: 'The Steam App ID of the game',
                        },
                    },
                    required: ['appid'],
                },
            },
            {
                name: 'steam_get_game_news',
                description: 'Get the latest news and announcements for a specific Steam game.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        appid: {
                            type: 'number',
                            description: 'Steam App ID of the game',
                        },
                        count: {
                            type: 'number',
                            description: 'Number of news items to fetch (default: 5)',
                        },
                    },
                    required: ['appid'],
                },
            },
            {
                name: 'steam_get_genres',
                description: 'Get a list of common Steam genres and categories for discovery.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'steam_get_top_sellers',
                description: 'Get the current global top selling games on Steam.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Maximum results to return (default: 10)',
                        },
                    },
                },
            },
            {
                name: 'steam_get_top_games',
                description:
                    'Browse top games for a specific Steam category or genre (e.g., "Action", "RPG", "Strategy").',
                inputSchema: {
                    type: 'object',
                    properties: {
                        genreId: {
                            type: 'string',
                            description: 'The name or ID of the genre to browse',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum results to return (default: 10)',
                        },
                    },
                },
            },
            {
                name: 'game_get_full_profile',
                description:
                    'Get a comprehensive game profile including metadata from Steam and visual assets (logo, hero, grid, icon) from SteamGridDB in a single request. This is the recommended tool for getting a complete overview of a game.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The game name to search for',
                        },
                    },
                    required: ['query'],
                },
            },
        ],
    };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'steam_search_game': {
                const result = await searchSteamGames(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_details': {
                const result = await getSteamGameDetails(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_dlc_list': {
                const result = await getSteamDLCList(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_reviews_summary': {
                const result = await getSteamReviewsSummary(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_game_news': {
                const result = await getSteamGameNews(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_genres': {
                const result = await getSteamGenres();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_top_sellers': {
                const result = await getSteamTopSellers(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steam_get_top_games': {
                const result = await getSteamTopGames(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steamgrid_search_game': {
                const result = await searchSteamGridGames(args as any, config);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'steamgrid_get_assets': {
                const result = await getSteamGridAssets(args as any, config);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case 'game_get_full_profile': {
                const result = await getFullGameProfile(args as any, config);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Game Encyclopedia MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
