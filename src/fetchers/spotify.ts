import { SpotifyArtist, SpotifyAlbum, SpotifyAlbumsResponse } from './types';

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