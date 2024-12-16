import { 
    SpotifyArtist, 
    SpotifyAlbum, 
    SpotifyAlbumsResponse, 
    SpotifyDetailedAlbumsResponse,
    SpotifyDetailedTracksResponse,
    SpotifyTrackDetail,
    DetailedAlbumData
} from './types';

export async function getArtistInfo(accessToken: string, artistId: string): Promise<SpotifyArtist> {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch artist info: ${response.statusText}`);
    }

    return response.json();
}

export async function getArtistAlbums(
    accessToken: string, 
    artistId: string, 
    limit: number = 50,
    offset: number = 0
): Promise<SpotifyAlbumsResponse> {
    const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch artist albums: ${response.statusText}`);
    }

    return response.json();
}

export async function getAllArtistAlbums(accessToken: string, artistId: string): Promise<SpotifyAlbum[]> {
    const firstPage = await getArtistAlbums(accessToken, artistId);
    const albums = [...firstPage.items];
    
    const totalAlbums = firstPage.total;
    const limit = firstPage.limit;
    
    // Fetch remaining pages if needed
    for (let offset = limit; offset < totalAlbums; offset += limit) {
        const page = await getArtistAlbums(accessToken, artistId, limit, offset);
        albums.push(...page.items);
    }
    
    return albums;
}

export async function getDetailedAlbums(accessToken: string, albumIds: string[]): Promise<SpotifyAlbum[]> {
    // Split albumIds into chunks of 20 (API limit)
    const chunks = [];
    for (let i = 0; i < albumIds.length; i += 20) {
        chunks.push(albumIds.slice(i, i + 20));
    }

    // Fetch each chunk
    const allAlbums: SpotifyAlbum[] = [];
    for (const chunk of chunks) {
        const response = await fetch(
            `https://api.spotify.com/v1/albums?ids=${chunk.join(',')}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch detailed album info: ${response.statusText}`);
        }

        const data: SpotifyDetailedAlbumsResponse = await response.json();
        allAlbums.push(...data.albums);
    }

    return allAlbums;
}

export async function getDetailedTracks(accessToken: string, trackIds: string[]): Promise<SpotifyTrackDetail[]> {
    // Split trackIds into chunks of 50 (API limit)
    const chunks = [];
    for (let i = 0; i < trackIds.length; i += 50) {
        chunks.push(trackIds.slice(i, i + 50));
    }

    // Fetch each chunk
    const allTracks: SpotifyTrackDetail[] = [];
    for (const chunk of chunks) {
        const response = await fetch(
            `https://api.spotify.com/v1/tracks?ids=${chunk.join(',')}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch detailed track info: ${response.statusText}`);
        }

        const data: SpotifyDetailedTracksResponse = await response.json();
        allTracks.push(...data.tracks);
    }

    return allTracks;
}

export async function getDetailedAlbumData(accessToken: string, album: SpotifyAlbum): Promise<DetailedAlbumData> {
    if (!album.tracks?.items) {
        throw new Error('Album does not contain track information');
    }

    // Get track IDs from the album
    const trackIds = album.tracks.items.map(track => track.id);

    // Fetch detailed track information
    const detailedTracks = await getDetailedTracks(accessToken, trackIds);

    return {
        ...album,
        detailed_tracks: detailedTracks
    };
} 