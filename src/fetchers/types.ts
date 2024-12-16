export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    external_urls: {
        spotify: string;
    };
    images: SpotifyImage[];
}

export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

export interface SpotifyAlbumArtist {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    album_type: string;
    album_group?: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    images: SpotifyImage[];
    release_date: string;
    release_date_precision: string;
    restrictions?: {
        reason: string;
    };
    type: string;
    uri: string;
    artists: SpotifyAlbumArtist[];
}

export interface SpotifyAlbumsResponse {
    href: string;
    items: SpotifyAlbum[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
} 