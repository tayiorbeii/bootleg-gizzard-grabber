import { readFileSync, writeFileSync } from 'fs';
import { SimplifiedOutput, SimplifiedAlbum, SimplifiedTrack } from './fetchers/types.js';

interface SongPerformance {
  album_name: string;
  release_date: string;
  track_number: number;
  duration_ms: number;
  popularity: number;
  uri: string;
}

interface Song {
  name: string;
  performances: SongPerformance[];
}

function cleanTrackName(name: string): string {
  // First clean up any live performance suffixes
  let cleanName = name
    .replace(/\s*\(Live in [^)]+\s+'24\)/, '')
    .replace(/\s*\(Live\)/, '')
    .replace(/\s*\(Live at [^)]+\)/, '')
    .trim();

  // Handle known typos and inconsistencies
  const corrections: { [key: string]: string } = {
    'Antartica': 'Antarctica',
    'Flight b741': 'Flight B741',
    'Flight B741': 'Flight B741',
    'Head On / Pill': 'Head On/Pill',
    'Head On/Pill': 'Head On/Pill',
    'Her and I (Slow Jam 2) (Live in Detroit \'24]': 'Her and I (Slow Jam 2)',
    'Her and I (Slow Jam 2) [Live in Atlanta \'24]': 'Her and I (Slow Jam 2)',
    'Ice-V': 'Ice V',
    'Ice V': 'Ice V',
    'King Gizzard & the Lizard Wizard W/King Stingray - Treaty': 'Treaty (Yothu Yindi cover with King Stingray)',
    'O.n.E.': 'O.N.E.',
    'O.N.E.': 'O.N.E.',
    'People Vultures': 'People-Vultures',
    'People-Vultures': 'People-Vultures',
    'Self Immolate': 'Self-Immolate',
    'Self-Immolate': 'Self-Immolate',
    'Soy Protein Munt Machine': 'Soy-Protein Munt Machine',
    'Soy-Protein Munt Machine': 'Soy-Protein Munt Machine',
    'Stressin\' (live)': 'Stressin\''
  };

  // Apply corrections if this name matches any known cases
  return corrections[cleanName] || cleanName;
}

function updateSourceData(inputData: SimplifiedOutput): SimplifiedOutput {
  // Use the same corrections map from cleanTrackName
  const corrections: { [key: string]: string } = {
    'Antartica': 'Antarctica', // Fix typo
    'Flight b741': 'Flight B741', // Standardize capitalization
    'Flight B741': 'Flight B741',
    'Head On / Pill': 'Head On/Pill', // Standardize spacing
    'Head On/Pill': 'Head On/Pill',
    'Her and I (Slow Jam 2) (Live in Detroit \'24]': 'Her and I (Slow Jam 2)',
    'Her and I (Slow Jam 2) [Live in Atlanta \'24]': 'Her and I (Slow Jam 2)',
    'Ice-V': 'Ice V', // Remove hyphen
    'Ice V': 'Ice V',
    'King Gizzard & the Lizard Wizard W/King Stingray - Treaty': 'Treaty (Yothu Yindi cover with King Stingray)',
    'O.n.E.': 'O.N.E.', // Standardize capitalization
    'O.N.E.': 'O.N.E.',
    'People Vultures': 'People-Vultures', // Add hyphen
    'People-Vultures': 'People-Vultures',
    'Self Immolate': 'Self-Immolate', // Add hyphen
    'Self-Immolate': 'Self-Immolate',
    'Soy Protein Munt Machine': 'Soy-Protein Munt Machine', // Add hyphen
    'Soy-Protein Munt Machine': 'Soy-Protein Munt Machine',
    'Stressin\' (live)': 'Stressin\'' // Remove live suffix
  };

  // Create a deep copy of the input data
  const updatedData = JSON.parse(JSON.stringify(inputData));

  // Update track names in each album
  updatedData.albums.forEach((album: SimplifiedAlbum) => {
    album.tracks.forEach((track: SimplifiedTrack) => {
      // First remove live suffixes
      const cleanName = track.name
        .replace(/\s*\(Live in [^)]+\s+'24\)/, '')
        .replace(/\s*\(Live\)/, '')
        .replace(/\s*\(Live at [^)]+\)/, '')
        .trim();

      // Then apply corrections if needed
      if (corrections[cleanName]) {
        // Keep the original live suffix if it exists
        const liveSuffix = track.name.match(/(\s*\(Live[^)]*\))/)?.[1] || '';
        track.name = corrections[cleanName] + liveSuffix;
      }
    });
  });

  return updatedData;
}

function updateAlbumsData(inputData: SimplifiedOutput): SimplifiedOutput {
  // Use the same corrections map from cleanTrackName
  const corrections: { [key: string]: string } = {
    'Antartica': 'Antarctica', // Fix typo
    'Flight b741': 'Flight B741', // Standardize capitalization
    'Flight B741': 'Flight B741',
    'Head On / Pill': 'Head On/Pill', // Standardize spacing
    'Head On/Pill': 'Head On/Pill',
    'Her and I (Slow Jam 2) (Live in Detroit \'24]': 'Her and I (Slow Jam 2)',
    'Her and I (Slow Jam 2) [Live in Atlanta \'24]': 'Her and I (Slow Jam 2)',
    'Ice-V': 'Ice V', // Remove hyphen
    'Ice V': 'Ice V',
    'King Gizzard & the Lizard Wizard W/King Stingray - Treaty': 'Treaty (Yothu Yindi cover with King Stingray)',
    'O.n.E.': 'O.N.E.', // Standardize capitalization
    'O.N.E.': 'O.N.E.',
    'People Vultures': 'People-Vultures', // Add hyphen
    'People-Vultures': 'People-Vultures',
    'Self Immolate': 'Self-Immolate', // Add hyphen
    'Self-Immolate': 'Self-Immolate',
    'Soy Protein Munt Machine': 'Soy-Protein Munt Machine', // Add hyphen
    'Soy-Protein Munt Machine': 'Soy-Protein Munt Machine',
    'Stressin\' (live)': 'Stressin\'' // Remove live suffix
  };

  // Create a deep copy of the input data
  const updatedData = JSON.parse(JSON.stringify(inputData));

  // Update track names in each album
  updatedData.albums.forEach((album: SimplifiedAlbum) => {
    album.tracks.forEach((track: SimplifiedTrack) => {
      // Get the base name without any live suffixes
      const cleanName = track.name
        .replace(/\s*\(Live in [^)]+\s+'24\)/, '')
        .replace(/\s*\(Live\)/, '')
        .replace(/\s*\(Live at [^)]+\)/, '')
        .trim();

      // Apply corrections if needed
      const correctedName = corrections[cleanName] || cleanName;
      track.name = correctedName;
    });
  });

  return updatedData;
}

function processData(inputData: SimplifiedOutput): Song[] {
  // Create a map to group performances by song name
  const songMap = new Map<string, Song>();

  // Process each album
  inputData.albums.forEach((album: SimplifiedAlbum) => {
    // Process each track in the album
    album.tracks.forEach((track: SimplifiedTrack) => {
      const cleanName = cleanTrackName(track.name);
      
      // Get or create song entry
      if (!songMap.has(cleanName)) {
        songMap.set(cleanName, {
          name: cleanName,
          performances: []
        });
      }

      // Add this performance to the song's list
      const song = songMap.get(cleanName)!;
      song.performances.push({
        album_name: album.name,
        release_date: album.release_date,
        track_number: track.track_number,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        uri: track.uri
      });
    });
  });

  // Convert map to array and sort songs alphabetically
  return Array.from(songMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));
}

function main() {
  try {
    // Read input file
    console.log('Reading bootleg_gizzard_24_data.json...');
    const inputData: SimplifiedOutput = JSON.parse(
      readFileSync('bootleg_gizzard_24_data.json', 'utf-8')
    );

    // Update the source data
    console.log('Updating source data with corrections...');
    const updatedData = updateSourceData(inputData);
    writeFileSync('bootleg_gizzard_24_data.json', JSON.stringify(updatedData, null, 2));

    // Create albums.json with corrected track names
    console.log('Creating albums.json with corrected track names...');
    const albumsData = updateAlbumsData(inputData);
    writeFileSync('albums.json', JSON.stringify(albumsData, null, 2));

    // Process the corrected data for songs.json
    console.log('Processing data for songs.json...');
    const songs = processData(updatedData);

    // Write songs output file
    console.log('Writing songs.json...');
    writeFileSync('songs.json', JSON.stringify({ songs }, null, 2));

    // Print summary
    console.log('\nSummary:');
    console.log(`Total unique songs: ${songs.length}`);
    
    // Find songs with most performances
    const topPerformed = [...songs]
      .sort((a, b) => b.performances.length - a.performances.length)
      .slice(0, 5);

    console.log('\nMost performed songs:');
    topPerformed.forEach(song => {
      console.log(`${song.name}: ${song.performances.length} performances`);
    });

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

main(); 