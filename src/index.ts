#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { searchSteamGames, getSteamGameDetails } from './tools/steam.js';
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
