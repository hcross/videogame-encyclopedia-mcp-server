/**
 * Type definitions for Steam and SteamGridDB API responses
 */

// Steam API Types
export interface SteamApp {
  appid: number;
  name: string;
}

export interface SteamStoreSearchResponse {
  total: number;
  items: {
    id: number;
    name: string;
    price?: {
      currency: string;
      initial: number;
      final: number;
    };
    platforms?: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
  }[];
}

export interface SteamAppDetails {
  steam_appid: number;
  name: string;
  type: string;
  short_description: string;
  detailed_description: string;
  about_the_game: string;
  header_image: string;
  capsule_image: string;
  website: string;
  developers?: string[];
  publishers?: string[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    final_formatted: string;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  categories?: { id: number; description: string }[];
  genres?: { id: string; description: string }[];
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  is_free: boolean;
  supported_languages: string;
}

// SteamGridDB API Types
export interface SteamGridGame {
  id: number;
  name: string;
  types: string[];
  verified: boolean;
}

export interface SteamGridSearchResponse {
  success: boolean;
  data: SteamGridGame[];
}

export interface SteamGridAsset {
  id: number;
  url: string;
  thumb: string;
  width: number;
  height: number;
  mime: string;
  language: string;
  author: {
    name: string;
    steam64: string;
    avatar: string;
  };
}

export interface SteamGridAssetsResponse {
  success: boolean;
  data: SteamGridAsset[];
}

export interface SteamGridLogoAsset extends SteamGridAsset {
  id: number;
  score: number;
  style: string;
  width: number;
  height: number;
  nsfw: boolean;
  humor: boolean;
  notes: string | null;
  mime: string;
  language: string;
  url: string;
  thumb: string;
  lock: boolean;
  epilepsy: boolean;
  upvotes: number;
  downvotes: number;
  author: {
    name: string;
    steam64: string;
    avatar: string;
  };
}

// MCP Tool Input Schemas
export interface SteamSearchInput {
  query: string;
  limit?: number;
}

export interface SteamDetailsInput {
  appid: number;
}

export interface SteamGridSearchInput {
  query: string;
}

export interface SteamGridAssetsInput {
  gameId: number;
  assetTypes?: ("grid" | "hero" | "logo" | "icon")[];
}

export interface SteamGridBestLogoInput {
  gameId?: number;
  appid?: number;
}

export interface SteamDLCListInput {
  appid: number;
}

export interface SteamDLC {
  appid: number;
  name: string;
}

export interface SteamReviewsSummaryInput {
  appid: number;
}

export interface SteamReview {
  recommendationid: string;
  review: string;
  voted_up: boolean;
  votes_up: number;
  weighted_vote_score: string;
}

export interface SteamReviewsSummary {
  appid: number;
  review_score: number;
  review_score_desc: string;
  total_positive: number;
  total_negative: number;
  total_reviews: number;
  percentage_score: number;
  top_reviews: string[];
}

export interface SteamTopGamesInput {
  genreId?: string;
  limit?: number;
}

export interface SteamNewsInput {
  appid: number;
  count?: number;
}

export interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
}

export interface SteamNewsResponse {
  appid: number;
  newsitems: SteamNewsItem[];
  count: number;
}

export interface SteamPlayerCountInput {
  appid: number;
}

export interface SteamPlayerCountResponse {
  player_count: number;
  result: number;
}
// Unified Tool Types
export interface UnifiedSearchInput {
  query: string;
}

export interface UnifiedGameProfile {
  metadata: {
    appid: number;
    name: string;
    type: string;
    short_description: string;
    developers: string[];
    publishers: string[];
    release_date: string;
    genres: string[];
    categories: string[];
    price?: string;
    website?: string;
  };
  assets: {
    header_image?: string; // From Steam
    hero?: string; // From SteamGridDB
    logo?: string; // From SteamGridDB
    icon?: string; // From SteamGridDB
    grid?: string; // From SteamGridDB
  };
}

// ScreenScraper API Types
export interface ScreenScraperSystem {
  id: number;
  name: string;
  shortname: string;
  manufacturer: string;
  releasedate: string;
  extensions?: string;
}

export interface ScreenScraperGame {
  id: number;
  name: string;
  system: {
    id: number;
    name: string;
  };
  region?: string;
  releasedate?: string;
  developer?: string;
  publisher?: string;
  players?: string;
  rating?: number;
  genres?: string[];
  synopsis?: {
    language: string;
    text: string;
  }[];
}

export interface ScreenScraperMedia {
  type: string;
  region?: string;
  format: string;
  url: string;
}

export interface ScreenScraperGameInfo extends ScreenScraperGame {
  media?: {
    screenshots?: ScreenScraperMedia[];
    covers?: ScreenScraperMedia[];
    wheels?: ScreenScraperMedia[];
    marquees?: ScreenScraperMedia[];
    videos?: ScreenScraperMedia[];
    fanarts?: ScreenScraperMedia[];
    boxes?: ScreenScraperMedia[];
    cartridges?: ScreenScraperMedia[];
    maps?: ScreenScraperMedia[];
  };
}

export interface ScreenScraperSearchInput {
  gameName: string;
  systemId?: number;
  language?: string;
}

export interface ScreenScraperGameInfoInput {
  gameId?: number;
  gameName?: string;
  systemId?: number;
  crc?: string;
  md5?: string;
  sha1?: string;
  romName?: string;
  romSize?: number;
  language?: string;
}
