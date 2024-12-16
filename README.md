# King Gizzard and the Lizard Wizard - Live in '24 Data

This repo includes scripts to fetch and process data from the Spotify API for King Gizzard and the Lizard Wizard's 2024 live albums and tracks.

The cleaned data can be found in the `albums.json` and `songs.json` files inside of `src/data`.

The `index.ts` file is the entry point for the script. It fetches the `bootleg gizzard` artist data, then the albums, then their tracks. This data is dumped to `bootleg_gizzard_24_data.json`. 

The `remixJson.ts` script cleans up some track names for the source data, and creates new `albums.json` and `songs.json` files, which will be used to seed a database later.