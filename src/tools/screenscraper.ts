import axios from "axios";
import type {
  ScreenScraperSearchInput,
  ScreenScraperGameInfoInput,
  ScreenScraperSystem,
  ScreenScraperGame,
  ScreenScraperGameInfo,
  ScreenScraperMedia,
} from "../types.js";
import { Config } from "../config.js";

const SCREENSCRAPER_API_BASE = "https://www.screenscraper.fr/api2";
const JEUINFOS_ENDPOINT = `${SCREENSCRAPER_API_BASE}/jeuInfos.php`;
const JEURECHERCHE_ENDPOINT = `${SCREENSCRAPER_API_BASE}/jeuRecherche.php`;
const SYSTEMESLIST_ENDPOINT = `${SCREENSCRAPER_API_BASE}/systemesListe.php`;

/**
 * Build common authentication parameters for ScreenScraper API
 */
function buildAuthParams(config: Config): Record<string, string> {
  if (!config.screenScraper) {
    throw new Error(
      "ScreenScraper is not configured. Please set SCREENSCRAPER_DEV_ID and SCREENSCRAPER_DEV_PASSWORD in your environment.",
    );
  }

  const params: Record<string, string> = {
    devid: config.screenScraper.devId,
    devpassword: config.screenScraper.devPassword,
    softname: config.screenScraper.softwareName,
    output: "json",
  };

  // Add user credentials if available
  if (config.screenScraper.userId && config.screenScraper.userPassword) {
    params.ssid = config.screenScraper.userId;
    params.sspassword = config.screenScraper.userPassword;
  }

  return params;
}

/**
 * Get a list of all supported gaming systems from ScreenScraper
 */
export async function getScreenScraperSystems(
  config: Config,
): Promise<ScreenScraperSystem[]> {
  const params = buildAuthParams(config);

  const response = await axios.get(SYSTEMESLIST_ENDPOINT, { params });

  if (
    !response.data ||
    !response.data.response ||
    !response.data.response.systemes
  ) {
    throw new Error("Failed to retrieve systems list from ScreenScraper");
  }

  const systems = response.data.response.systemes;

  return Object.values(systems).map((sys: any) => ({
    id: parseInt(sys.id),
    name: sys.noms?.nom_eu || sys.noms?.nom_us || sys.noms?.nom_jp || "Unknown",
    shortname: sys.shortname || "",
    manufacturer: sys.compagnie || "",
    releasedate: sys.datesortie || "",
    extensions: sys.extensions || "",
  }));
}

/**
 * Search for games on ScreenScraper by name
 */
export async function searchScreenScraperGames(
  input: ScreenScraperSearchInput,
  config: Config,
): Promise<ScreenScraperGame[]> {
  const { gameName, systemId, language = "en" } = input;

  const params: any = {
    ...buildAuthParams(config),
    recherche: gameName,
  };

  if (systemId) {
    params.systemeid = systemId.toString();
  }

  const response = await axios.get(JEURECHERCHE_ENDPOINT, { params });

  if (
    !response.data ||
    !response.data.response ||
    !response.data.response.jeux
  ) {
    return [];
  }

  const games = response.data.response.jeux;

  return Object.values(games).map((game: any) => {
    const gameName =
      game.noms?.find((n: any) => n.region === language)?.text ||
      game.noms?.[0]?.text ||
      "Unknown";

    const synopsis = game.synopsis
      ? Object.values(game.synopsis).map((s: any) => ({
          language: s.langue || "en",
          text: s.text || "",
        }))
      : [];

    return {
      id: parseInt(game.id),
      name: gameName,
      system: {
        id: parseInt(game.systeme?.id || 0),
        name: game.systeme?.text || "Unknown",
      },
      region: game.region || undefined,
      releasedate: game.dates?.[0]?.text || undefined,
      developer: game.developpeur?.text || undefined,
      publisher: game.editeur?.text || undefined,
      players: game.joueurs?.text || undefined,
      rating: game.note ? parseFloat(game.note) : undefined,
      genres: game.genres
        ? Object.values(game.genres).map((g: any) => g.text)
        : [],
      synopsis,
    };
  });
}

/**
 * Get detailed game information including media from ScreenScraper
 */
export async function getScreenScraperGameInfo(
  input: ScreenScraperGameInfoInput,
  config: Config,
): Promise<ScreenScraperGameInfo> {
  const {
    gameId,
    gameName,
    systemId,
    crc,
    md5,
    sha1,
    romName,
    romSize,
    language = "en",
  } = input;

  const params: any = {
    ...buildAuthParams(config),
  };

  // Add search criteria
  if (gameId) {
    params.gameid = gameId.toString();
  }
  if (gameName) {
    params.romnom = gameName;
  }
  if (systemId) {
    params.systemeid = systemId.toString();
  }
  if (crc) {
    params.crc = crc;
  }
  if (md5) {
    params.md5 = md5;
  }
  if (sha1) {
    params.sha1 = sha1;
  }
  if (romName) {
    params.romnom = romName;
  }
  if (romSize) {
    params.romtaille = romSize.toString();
  }

  const response = await axios.get(JEUINFOS_ENDPOINT, { params });

  if (
    !response.data ||
    !response.data.response ||
    !response.data.response.jeu
  ) {
    throw new Error("Game not found on ScreenScraper");
  }

  const game = response.data.response.jeu;

  // Parse game name
  const gameName_result =
    game.noms?.find((n: any) => n.region === language)?.text ||
    game.noms?.[0]?.text ||
    "Unknown";

  // Parse synopsis
  const synopsis = game.synopsis
    ? Object.values(game.synopsis).map((s: any) => ({
        language: s.langue || "en",
        text: s.text || "",
      }))
    : [];

  // Parse media
  const media: ScreenScraperGameInfo["media"] = {};

  if (game.medias) {
    const groupMedia = (
      mediaArray: any[],
      type: string,
    ): ScreenScraperMedia[] => {
      return mediaArray
        .filter((m: any) => m.type === type)
        .map((m: any) => ({
          type: m.type,
          region: m.region || undefined,
          format: m.format || "unknown",
          url: m.url,
        }));
    };

    const allMedia = Object.values(game.medias);

    media.screenshots = groupMedia(allMedia, "ss");
    media.covers = groupMedia(allMedia, "box-2D");
    media.wheels = groupMedia(allMedia, "wheel");
    media.marquees = groupMedia(allMedia, "screenmarquee");
    media.videos = groupMedia(allMedia, "video");
    media.fanarts = groupMedia(allMedia, "fanart");
    media.boxes = groupMedia(allMedia, "box-3D");
    media.cartridges = groupMedia(allMedia, "support-2D");
    media.maps = groupMedia(allMedia, "map");
  }

  return {
    id: parseInt(game.id),
    name: gameName_result,
    system: {
      id: parseInt(game.systeme?.id || 0),
      name: game.systeme?.text || "Unknown",
    },
    region: game.region || undefined,
    releasedate: game.dates?.[0]?.text || undefined,
    developer: game.developpeur?.text || undefined,
    publisher: game.editeur?.text || undefined,
    players: game.joueurs?.text || undefined,
    rating: game.note ? parseFloat(game.note) : undefined,
    genres: game.genres
      ? Object.values(game.genres).map((g: any) => g.text)
      : [],
    synopsis,
    media,
  };
}
