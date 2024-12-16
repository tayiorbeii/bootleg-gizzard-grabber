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

export interface SpotifyTrackArtist extends SpotifyAlbumArtist {}

export interface SpotifyTrackDetail {
    album: SpotifyAlbum;
    artists: SpotifyTrackArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc?: string;
        ean?: string;
        upc?: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface SpotifyDetailedTracksResponse {
    tracks: SpotifyTrackDetail[];
}

export interface SpotifyTrack {
    artists: SpotifyTrackArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    name: string;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface SpotifyTracks {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

export interface SpotifyCopyright {
    text: string;
    type: string;
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
    tracks?: SpotifyTracks;
    copyrights?: SpotifyCopyright[];
    external_ids?: {
        isrc?: string;
        ean?: string;
        upc?: string;
    };
    genres?: string[];
    label?: string;
    popularity?: number;
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

export interface SpotifyDetailedAlbumsResponse {
    albums: SpotifyAlbum[];
}

export interface DetailedAlbumData extends SpotifyAlbum {
    detailed_tracks: SpotifyTrackDetail[];
}

export interface SimplifiedTrack {
    name: string;
    track_number: number;
    duration_ms: number;
    href: string;
    uri: string;
    preview_url: string | null;
    popularity: number;
}

export interface SimplifiedAlbum {
    name: string;
    release_date: string;
    total_tracks: number;
    href: string;
    uri: string;
    cover_image: string;
    popularity: number;
    tracks: SimplifiedTrack[];
}

export interface SimplifiedArtist {
    name: string;
    id: string;
    spotify_url: string;
    image_url: string | null;
}

export interface SimplifiedOutput {
    artist: SimplifiedArtist;
    albums: SimplifiedAlbum[];
} 