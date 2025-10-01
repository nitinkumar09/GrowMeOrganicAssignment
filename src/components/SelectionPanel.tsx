import { X } from 'lucide-react';
import { Artwork } from '../types/artwork';

interface SelectionPanelProps {
  selectedArtworks: Artwork[];
  onRemove: (id: number) => void;
}

export const SelectionPanel = ({ selectedArtworks, onRemove }: SelectionPanelProps) => {
  if (selectedArtworks.length === 0) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Selected Artworks</h2>
        <p className="text-gray-500 text-center py-4">No rows selected yet</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Selected Artworks ({selectedArtworks.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {selectedArtworks.map((artwork) => (
          <div
            key={artwork.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <span className="text-sm text-gray-700 truncate flex-1 mr-2" title={artwork.title}>
              {artwork.title}
            </span>
            <button
              onClick={() => onRemove(artwork.id)}
              className="flex-shrink-0 p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove selection"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
