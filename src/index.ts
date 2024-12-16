import "dotenv/config";
import { writeFileSync } from "fs";
import {
  fetchArtistData,
  fetch2024Albums,
  fetchDetailedAlbumData,
  createSimplifiedOutput,
  getTopTracksFromAlbum,
} from "./fetchAlbumAndTrackData.js";
import { SimplifiedAlbum } from "./fetchers/types.js";

async function main(): Promise<void> {
  try {
    // Artist ID for "bootleg gizzard"
    const artistId = "0rUZnb9ntl9GXWLhj8cABs";

    // Get artist information
    console.log("Fetching artist information...");
    const artist = await fetchArtistData(artistId);
    console.log("Artist Information:");
    console.log(`Name: ${artist.name}`);
    console.log(`Genres: ${artist.genres.join(", ")}`);
    console.log(`Popularity: ${artist.popularity}`);
    console.log(`Spotify URL: ${artist.external_urls.spotify}`);
    if (artist.images?.[0]) {
      console.log(`Profile Image: ${artist.images[0].url}\n`);
    }

    // Get all 2024 albums
    console.log("Fetching all albums...");
    const albums24 = await fetch2024Albums(artistId);
    console.log(
      `Found ${albums24.length} albums from '24. Fetching detailed information...\n`
    );

    // Get detailed album data
    console.log("Fetching detailed track information...");
    const detailedAlbumData = await fetchDetailedAlbumData(albums24);

    // Create simplified output
    const outputData = createSimplifiedOutput(artist, detailedAlbumData);
    writeFileSync(
      "bootleg_gizzard_24_data.json",
      JSON.stringify(outputData, null, 2)
    );
    console.log("\nData has been saved to bootleg_gizzard_24_data.json");

    // Display summary
    console.log("\nSummary:");
    console.log(`Total albums: ${outputData.albums.length}`);
    console.log(
      `Total tracks: ${outputData.albums.reduce(
        (sum: number, album: SimplifiedAlbum) => sum + album.total_tracks,
        0
      )}`
    );

    // Display album list with popularity
    console.log("\nAlbum List:");
    outputData.albums.forEach((album: SimplifiedAlbum, index: number) => {
      console.log(`\n${index + 1}. ${album.name}`);
      console.log(`   Release Date: ${album.release_date}`);
      console.log(`   Tracks: ${album.total_tracks}`);
      console.log(`   Popularity: ${album.popularity}`);

      // Find most popular tracks
      const topTracks = getTopTracksFromAlbum(album);
      if (topTracks.length > 0) {
        console.log("   Most Popular Tracks:");
        topTracks.forEach((track) => {
          console.log(`     - ${track.name} (Popularity: ${track.popularity})`);
        });
      }
    });
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

main();
