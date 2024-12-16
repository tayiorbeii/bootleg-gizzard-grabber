# King Gizzard and the Lizard Wizard - Live in '24 Data

This repo includes scripts to fetch and process data from the Spotify API for King Gizzard and the Lizard Wizard's 2024 live albums and tracks.

The cleaned data can be found in the `albums.json` and `songs.json` files inside of `src/data`, but here are some highlights:

## Data Insights

### Most Performed Songs (across 38 shows)
- 16 performances: "Field of Vision"
- 15 performances: "Le Risque"
- 14 performances: "Raw Feel"
- 13 performances: "Antarctica", "Daily Blues", "Dragon", "Flamethrower"
- 12 performances: "Rats in the Sky", "Sad Pilot"
- 11 performances: "Extinction", "Flight B741", "Gila Monster", "Motor Spirit"
- 10 performances: "Converge", "Gaia", "Mars for the Rich", "Mirage City", "Set", "Supercell", "Witchcraft"

### Most Popular Albums (by Spotify popularity)
- Live at The Gorge 2024-09-14
- Live in Stanford 2024-11-04
- Live in San Diego 2024-11-02
- Live in Chicago 2024-09-01
- Live in Phoenix 2024-11-09
- Live at Forest Hills Stadium, Queens, NY 2024-08-17
- Live at Forest Hills Stadium, Queens, NY 2024-08-16
- Live in Los Angeles 2024-11-01
- Live in Kentucky 2024-08-25
- Live in Austin 2024-11-15

### Longest Individual Performances
- "Head On/Pill" - 29:18 at Live in Austin '24
- "The River" - 28:09 at Live in Philadelphia '24
- "The Dripping Tap" - 22:34 at Live in Milwaukee '24
- "Hypertension" - 19:56 at Live in Minneapolis '24
- "Set" - 19:37 at Live in Chicago '24
- "Her and I (Slow Jam 2)" - 18:59 at Live in Atlanta '24
- "Theia" - 17:49 at Live in San Francisco '24
- "The Silver Cord" - 17:26 at Live in Maine '24
- "Am I in Heaven?" - 16:47 at Live in Los Angeles '24
- "Extinction" - 16:13 at Live in San Francisco '24

---

## Technical Details

To run the scripts, you'll need to set up a Spotify API key. You can do this by creating a new app in the Spotify Developer Dashboard and creating a `.env` file in the project root with the following variables:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

The `index.ts` file is the entry point for the script. It fetches the `bootleg gizzard` artist data, then the albums, then their tracks. This data is dumped to `bootleg_gizzard_24_data.json`. 

The `remixJson.ts` script cleans up some track names for the source data, and creates new `albums.json` and `songs.json` files, which will be used to seed a database later.