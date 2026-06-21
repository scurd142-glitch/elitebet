/**
 * The Odds API Integration
 * Documentation: https://the-odds-api.com/
 * 
 * This service provides a structured interface for fetching sports betting odds.
 * Set NEXT_PUBLIC_ODDS_API_KEY in your .env file to use the real API.
 */

const API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY;
const API_BASE = "https://api.the-odds-api.com/v4";

export interface Sport {
  key: string;
  active: boolean;
  group: string;
  details: string;
  title: string;
}

export interface Odds {
  name: string;
  price: number;
  point?: number;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: {
    key: string;
    last_update: string;
    outcomes: Odds[];
  }[];
}

export interface Match {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

/**
 * Fetch available sports
 */
export async function getSports(): Promise<Sport[]> {
  if (!API_KEY) {
    // Return mock sports if no API key
    return [
      { key: "soccer_epl", active: true, group: "Soccer", details: "English Premier League", title: "Premier League" },
      { key: "soccer_uefa_champs_league", active: true, group: "Soccer", details: "UEFA Champions League", title: "Champions League" },
      { key: "basketball_nba", active: true, group: "Basketball", details: "NBA", title: "NBA" },
      { key: "americanfootball_nfl", active: true, group: "American Football", details: "NFL", title: "NFL" },
    ];
  }

  const response = await fetch(`${API_BASE}/sports/?apiKey=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch sports");
  return response.json();
}

/**
 * Fetch odds for a specific sport
 */
export async function getOdds(sportKey: string, regions: string = "eu", markets: string = "h2h"): Promise<Match[]> {
  if (!API_KEY) {
    // Return mock odds if no API key
    return getMockOdds(sportKey);
  }

  const response = await fetch(`${API_BASE}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=${regions}&markets=${markets}`);
  if (!response.ok) throw new Error("Failed to fetch odds");
  return response.json();
}

/**
 * Mock odds data for development/demo purposes
 */
function getMockOdds(sportKey: string): Match[] {
  const mockMatches: Match[] = [
    {
      id: "1",
      sport_key: sportKey,
      sport_title: "Soccer",
      commence_time: new Date(Date.now() + 3600000).toISOString(),
      home_team: "Gor Mahia",
      away_team: "AFC Leopards",
      bookmakers: [
        {
          key: "mock",
          title: "NiteBet",
          last_update: new Date().toISOString(),
          markets: [
            {
              key: "h2h",
              last_update: new Date().toISOString(),
              outcomes: [
                { name: "Gor Mahia", price: 2.5 },
                { name: "Draw", price: 3.2 },
                { name: "AFC Leopards", price: 2.8 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      sport_key: sportKey,
      sport_title: "Soccer",
      commence_time: new Date(Date.now() + 7200000).toISOString(),
      home_team: "Tusker FC",
      away_team: "KCB",
      bookmakers: [
        {
          key: "mock",
          title: "NiteBet",
          last_update: new Date().toISOString(),
          markets: [
            {
              key: "h2h",
              last_update: new Date().toISOString(),
              outcomes: [
                { name: "Tusker FC", price: 1.8 },
                { name: "Draw", price: 3.5 },
                { name: "KCB", price: 4.2 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      sport_key: sportKey,
      sport_title: "Soccer",
      commence_time: new Date(Date.now() + 10800000).toISOString(),
      home_team: "Manchester United",
      away_team: "Liverpool",
      bookmakers: [
        {
          key: "mock",
          title: "NiteBet",
          last_update: new Date().toISOString(),
          markets: [
            {
              key: "h2h",
              last_update: new Date().toISOString(),
              outcomes: [
                { name: "Manchester United", price: 2.1 },
                { name: "Draw", price: 3.4 },
                { name: "Liverpool", price: 3.3 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "4",
      sport_key: sportKey,
      sport_title: "Soccer",
      commence_time: new Date(Date.now() + 14400000).toISOString(),
      home_team: "Real Madrid",
      away_team: "Barcelona",
      bookmakers: [
        {
          key: "mock",
          title: "NiteBet",
          last_update: new Date().toISOString(),
          markets: [
            {
              key: "h2h",
              last_update: new Date().toISOString(),
              outcomes: [
                { name: "Real Madrid", price: 2.3 },
                { name: "Draw", price: 3.2 },
                { name: "Barcelona", price: 3.1 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "5",
      sport_key: sportKey,
      sport_title: "Soccer",
      commence_time: new Date(Date.now() + 18000000).toISOString(),
      home_team: "Juventus",
      away_team: "AC Milan",
      bookmakers: [
        {
          key: "mock",
          title: "NiteBet",
          last_update: new Date().toISOString(),
          markets: [
            {
              key: "h2h",
              last_update: new Date().toISOString(),
              outcomes: [
                { name: "Juventus", price: 2.0 },
                { name: "Draw", price: 3.3 },
                { name: "AC Milan", price: 3.7 },
              ],
            },
          ],
        },
      ],
    },
  ];

  return mockMatches;
}
