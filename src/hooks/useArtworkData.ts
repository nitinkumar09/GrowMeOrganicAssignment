import { useState, useEffect, useCallback } from 'react';
import { Artwork } from '../types/artwork';
import { fetchArtworks } from '../services/artworkService';

const ROWS_PER_PAGE = 12;

export const useArtworkData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [artworkCache, setArtworkCache] = useState<Map<number, Artwork>>(new Map());

  const loadPageData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page);
      setCurrentPageData(response.data);
      setTotalRecords(response.pagination.total);

      setArtworkCache(prev => {
        const newCache = new Map(prev);
        response.data.forEach(artwork => {
          newCache.set(artwork.id, artwork);
        });
        return newCache;
      });
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData(currentPage);
  }, [currentPage, loadPageData]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const first = (currentPage - 1) * ROWS_PER_PAGE;

  const fetchMultiplePages = useCallback(async (count: number) => {
    const pagesToFetch = Math.ceil(count / ROWS_PER_PAGE);
    const promises = [];

    for (let i = 1; i <= pagesToFetch; i++) {
      promises.push(fetchArtworks(i));
    }

    try {
      const responses = await Promise.all(promises);
      const allArtworks: Artwork[] = [];

      responses.forEach(response => {
        allArtworks.push(...response.data);
      });

      setArtworkCache(prev => {
        const newCache = new Map(prev);
        allArtworks.slice(0, count).forEach(artwork => {
          newCache.set(artwork.id, artwork);
        });
        return newCache;
      });

      return allArtworks.slice(0, count);
    } catch (error) {
      console.error('Failed to fetch multiple pages:', error);
      return [];
    }
  }, []);

  return {
    currentPageData,
    totalRecords,
    loading,
    currentPage,
    first,
    onPageChange,
    artworkCache,
    ROWS_PER_PAGE,
    fetchMultiplePages,
  };
};
