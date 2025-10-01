import { useState, useCallback } from 'react';
import { Artwork } from '../types/artwork';

export const useSelectionManager = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet; 
    });
  }, []);

  const togglePageSelection = useCallback((pageItems: Artwork[], allSelected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      pageItems.forEach(item => {
        if (allSelected) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
      });
      return newSet; 
    });
  }, []);

  const removeSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet; 
    });
  }, []);

  const bulkSelect = useCallback((artworks: Artwork[]) => {
    setSelectedIds(new Set(artworks.map(a => a.id))); 
  }, []);

  const isSelected = useCallback((id: number) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const getSelectedArtworks = useCallback(
    (artworkMap: Map<number, Artwork>) => {
      return Array.from(selectedIds)
        .map(id => artworkMap.get(id))
        .filter((artwork): artwork is Artwork => artwork !== undefined);
    },
    [selectedIds]
  );

  return {
    selectedIds,
    toggleSelection,
    togglePageSelection,
    removeSelection,
    bulkSelect,
    isSelected,
    getSelectedArtworks,
  };
};
