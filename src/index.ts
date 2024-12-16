import 'dotenv/config';
import { writeFileSync } from 'fs';
import { getSpotifyAccessToken } from './fetchers/auth';
import { getArtistInfo, getAllArtistAlbums, getDetailedAlbums, getDetailedAlbumData } from './fetchers/spotify';
import { DetailedAlbumData, SimplifiedOutput, SimplifiedAlbum, SimplifiedTrack } from './fetchers/types';

async function main() {
    try {
        const accessToken = await getSpotifyAccessToken();
        console.log('Successfully obtained access token\n');

        // Artist ID for "bootleg gizzard"
        const artistId = '0rUZnb9ntl9GXWLhj8cABs';
        
        // Get artist information
        const artist = await getArtistInfo(accessToken, artistId);
        console.log('Artist Information:');
        console.log(`Name: ${artist.name}`);
        console.log(`Genres: ${artist.genres.join(', ')}`);
        console.log(`Popularity: ${artist.popularity}`);
        console.log(`Spotify URL: ${artist.external_urls.spotify}`);
        if (artist.images.length > 0) {
            console.log(`Profile Image: ${artist.images[0].url}\n`);
        }

        // Get all albums and filter for '24 albums
        console.log('Fetching all albums...');
        const allAlbums = await getAllArtistAlbums(accessToken, artistId);
        const albums24 = allAlbums
            .filter(album => album.name.includes('24'))
            .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

        // Get detailed information for '24 albums
        console.log(`Found ${albums24.length} albums from '24. Fetching detailed information...\n`);
        const detailedAlbums = await getDetailedAlbums(accessToken, albums24.map(a => a.id));
        
        // Get detailed track information for each album
        console.log('Fetching detailed track information...');
        const detailedAlbumData: DetailedAlbumData[] = [];
        
        for (const album of detailedAlbums) {
            console.log(`Processing album: ${album.name}`);
            const albumData = await getDetailedAlbumData(accessToken, album);
            detailedAlbumData.push(albumData);
        }

        // Sort albums by release date
        detailedAlbumData.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

        // Create simplified output
        const simplifiedAlbums: SimplifiedAlbum[] = detailedAlbumData.map(album => {
            const simplifiedTracks: SimplifiedTrack[] = album.detailed_tracks.map(track => ({
                name: track.name,
                track_number: track.track_number,
                duration_ms: track.duration_ms,
                href: track.href,
                uri: track.uri,
                preview_url: track.preview_url,
                popularity: track.popularity || 0
            }));

            return {
                name: album.name,
                release_date: album.release_date,
                total_tracks: album.total_tracks,
                href: album.href,
                uri: album.uri,
                cover_image: album.images[0]?.url || '',
                popularity: album.popularity || 0,
                tracks: simplifiedTracks
            };
        });

        const outputData: SimplifiedOutput = {
            artist: {
                name: artist.name,
                id: artist.id,
                spotify_url: artist.external_urls.spotify,
                image_url: artist.images[0]?.url || null
            },
            albums: simplifiedAlbums
        };

        writeFileSync('bootleg_gizzard_24_data.json', JSON.stringify(outputData, null, 2));
        console.log('\nData has been saved to bootleg_gizzard_24_data.json');

        // Display summary
        console.log('\nSummary:');
        console.log(`Total albums: ${simplifiedAlbums.length}`);
        console.log(`Total tracks: ${simplifiedAlbums.reduce((sum, album) => sum + album.total_tracks, 0)}`);
        
        // Display album list with popularity
        console.log('\nAlbum List:');
        simplifiedAlbums.forEach((album, index) => {
            console.log(`\n${index + 1}. ${album.name}`);
            console.log(`   Release Date: ${album.release_date}`);
            console.log(`   Tracks: ${album.total_tracks}`);
            console.log(`   Popularity: ${album.popularity}`);
            
            // Find most popular tracks
            const topTracks = [...album.tracks]
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 3);
            
            if (topTracks.length > 0) {
                console.log('   Most Popular Tracks:');
                topTracks.forEach(track => {
                    console.log(`     - ${track.name} (Popularity: ${track.popularity})`);
                });
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
