import { getSpotifyAccessToken } from './fetchers/auth.js';
import { getArtistInfo, getAllArtistAlbums, getDetailedAlbums, getDetailedAlbumData } from './fetchers/spotify.js';
import { 
    DetailedAlbumData, 
    SimplifiedOutput, 
    SimplifiedAlbum, 
    SimplifiedTrack, 
    SpotifyArtist, 
    SpotifyAlbum 
} from './fetchers/types.js';

export async function fetchArtistData(artistId: string): Promise<SpotifyArtist> {
    const accessToken = await getSpotifyAccessToken();
    return await getArtistInfo(accessToken, artistId);
}

export async function fetch2024Albums(artistId: string): Promise<SpotifyAlbum[]> {
    const accessToken = await getSpotifyAccessToken();
    const allAlbums = await getAllArtistAlbums(accessToken, artistId);
    return allAlbums
        .filter((album: SpotifyAlbum) => album.name.includes('24'))
        .sort((a: SpotifyAlbum, b: SpotifyAlbum) => 
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
}

export async function fetchDetailedAlbumData(albums: SpotifyAlbum[]): Promise<DetailedAlbumData[]> {
    const accessToken = await getSpotifyAccessToken();
    const detailedAlbums = await getDetailedAlbums(accessToken, albums.map(a => a.id));
    
    const detailedAlbumData: DetailedAlbumData[] = [];
    for (const album of detailedAlbums) {
        const albumData = await getDetailedAlbumData(accessToken, album);
        detailedAlbumData.push(albumData);
    }

    return detailedAlbumData.sort((a, b) => 
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
}

export function createSimplifiedOutput(
    artist: SpotifyArtist, 
    detailedAlbumData: DetailedAlbumData[]
): SimplifiedOutput {
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
            cover_image: album.images?.[0]?.url || '',
            popularity: album.popularity || 0,
            tracks: simplifiedTracks
        };
    });

    return {
        artist: {
            name: artist.name,
            id: artist.id,
            spotify_url: artist.external_urls.spotify,
            image_url: artist.images[0]?.url || null
        },
        albums: simplifiedAlbums
    };
}

export function getTopTracksFromAlbum(album: SimplifiedAlbum, count: number = 3): SimplifiedTrack[] {
    return [...album.tracks]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, count);
} 