export function normalizeArtist(artist) {
    return artist.replace(/\$/g, "S").trim();
}

export function cleanTitle(title) {
    return title
        .replace(/\s*\([^)]*(feat\.|with|prod)[^)]*\)/gi, "")
        .replace(/\s*\[[^\]]*(feat\.|with|prod)[^\]]*\]/gi, "")
        .replace(/\s*feat\..*/gi, "")
        .replace(/\s*with .*/gi, "")
        .replace(/\s*prod\..*/gi, "")
        .trim();
}

export async function getCoverArt(artist, song, album = "") {
    const musicBrainzBaseURL = "https://musicbrainz.org/ws/2";
    const coverArtBaseURL = "https://coverartarchive.org/release-group/";

    try {
        let searchQuery = `recording:${encodeURIComponent(song)} AND artist:${encodeURIComponent(artist)}`;
        if (album) {
            searchQuery += ` AND release:${encodeURIComponent(album)}`;
        }

        const searchUrl = `${musicBrainzBaseURL}/recording/?query=${searchQuery}&fmt=json`;

        const response = await fetch(searchUrl, {
            headers: {
                "User-Agent": "MyMusicApp/1.0 (your_email@example.com)"
            }
        });

        const data = await response.json();

        if (!data.recordings || data.recordings.length === 0) return null;

        let selectedReleaseGroupId = null;

        for (const recording of data.recordings) {
            if (!recording.releases) continue;

            for (const release of recording.releases) {
                if (!release["release-group"]) continue;

                const releaseGroup = release["release-group"];
                const releaseGroupId = releaseGroup.id;
                const releaseGroupTitle = releaseGroup.title.toLowerCase();

                if (album && releaseGroupTitle === album.toLowerCase()) {
                    selectedReleaseGroupId = releaseGroupId;
                    break;
                }

                if (!selectedReleaseGroupId) {
                    selectedReleaseGroupId = releaseGroupId;
                }
            }

            if (selectedReleaseGroupId) break;
        }

        const coverArtUrl = `${coverArtBaseURL}${selectedReleaseGroupId}/front`;
        const coverResponse = await fetch(coverArtUrl, { method: "HEAD" });

        if (coverResponse.ok) return coverArtUrl;

        return null;
    } catch (error) {
        console.warn("getCoverArt error:", error);
        return null;
    }
}

export async function trySmartCoverArt(artistRaw, titleRaw, albumRaw = "") {
    const cleanedTitle = cleanTitle(titleRaw);
    let cover = await getCoverArt(artistRaw, cleanedTitle, albumRaw);
    if (cover) return cover;

    const normalizedArtist = normalizeArtist(artistRaw);
    cover = await getCoverArt(normalizedArtist, cleanedTitle, albumRaw);
    if (cover) return cover;

    cover = await getCoverArt(normalizedArtist, cleanedTitle, "");
    if (cover) return cover;

    return null;
}
