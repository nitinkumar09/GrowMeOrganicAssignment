import { ArtworkAPIResponse } from '../types/artwork';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const ROWS_PER_PAGE = 12;
export const fetchArtworks = async (page: number): Promise<ArtworkAPIResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?page=${page}&limit=${ROWS_PER_PAGE}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArtworkAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};
