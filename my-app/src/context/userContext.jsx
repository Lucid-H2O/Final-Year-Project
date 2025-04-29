import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {

    const [details, setDetails] = useState(
        {
            name: 'Counter-Strike 2',
            description: 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.',
            header_image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045',
            website: 'http://counter-strike.net/',
            developers: ['Ubisoft Quebec',
                'Ubisoft Belgrade',
                'Ubisoft Bordeaux',
            ],
            publishers: ['Valve'],
            categories: ['Single-player',
                'Steam Achievements',
                'Steam Trading Cards',
                'Captions available',
                'In-App Purchases',
                'Partial Controller Support',
                'HDR available'
            ],
            genres: ['Action', 'Adventure', 'RPG'],
            tags:['FPS',
                'Shooter',
                'Multiplayer',
                'Competitive',
                'Action',
                'Team-Based',
                'eSports',
                'Tactical',
                'First-Person',
                'PvP',
                'Online Co-Op',
                'Co-op',
                'Strategy',
                'Military',
                'War',
                'Difficult',
                'Trading',
                'Realistic',
                'Fast-Paced',
                'Moddable'],
            players: 0,
            release_date: '21 Aug, 2012',
            wordCloud: [
                ['game', 11805],
                ['fun', 3622],
                ['drug', 3038],
                ['good', 2415],
                ['like', 1868],
                ['just', 1634],
                ['love', 1505],
                ['great', 1377],
                ['play', 1252],
                ['make', 1134]
              ],
            reviewCount : 0,
            aspects_with_sentiment : [
              { term: "graphics", sentiment: "positive" },
              { term: "graphics", sentiment: "positive" },
              { term: "combat", sentiment: "negative" },
              { term: "ui", sentiment: "negative" },
              { term: "ui", sentiment: "negative" },
            ],
            "pos_reviews_count": 75,
            "neg_reviews_count": 25,
            timestamp_updated: [
                {"month": "2024-01", "count": 15},
                {"month": "2024-02", "count": 43},
                {"month": "2024-03", "count": 88},
              ],
        }
    );

    return (
        <UserContext.Provider value={{details, setDetails }}>
            {children}
        </UserContext.Provider>
    );
}