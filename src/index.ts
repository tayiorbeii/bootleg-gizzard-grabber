import 'dotenv/config';
import { getSpotifyAccessToken } from './fetchers/auth';
import { getArtistInfo, getAllArtistAlbums } from './fetchers/spotify';

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

        // Get all albums
        console.log('Fetching all albums...');
        const albums = await getAllArtistAlbums(accessToken, artistId);
        
        console.log(`Found ${albums.length} albums:`);
        albums.forEach((album, index) => {
            console.log(`\n${index + 1}. ${album.name}`);
            console.log(`   Type: ${album.album_type}${album.album_group ? ` (${album.album_group})` : ''}`);
            console.log(`   Release Date: ${album.release_date} (${album.release_date_precision})`);
            console.log(`   Tracks: ${album.total_tracks}`);
            console.log(`   Spotify URI: ${album.uri}`);
            console.log(`   Spotify URL: ${album.external_urls.spotify}`);
            if (album.available_markets) {
                console.log(`   Available in ${album.available_markets.length} markets`);
            }
            if (album.images.length > 0) {
                console.log(`   Cover Image: ${album.images[0].url}`);
            }
            if (album.artists.length > 1) {
                console.log(`   Featured Artists: ${album.artists.slice(1).map(a => a.name).join(', ')}`);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
