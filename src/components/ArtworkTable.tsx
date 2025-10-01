import { useMemo, useCallback, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Artwork } from '../types/artwork';
import { useArtworkData } from '../hooks/useArtworkData';
import { useSelectionManager } from '../hooks/useSelectionManager';
import { SelectionPanel } from './SelectionPanel';
import { BulkSelectionOverlay } from './BulkSelectionOverlay';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const ArtworkTable = () => {
  const {
    currentPageData,
    totalRecords,
    loading,
    first,
    onPageChange,
    artworkCache,
    ROWS_PER_PAGE,
    fetchMultiplePages,
  } = useArtworkData();

  const {
    selectedIds,
    toggleSelection,
    togglePageSelection,
    removeSelection,
    bulkSelect,
    isSelected,
    getSelectedArtworks,
  } = useSelectionManager();

  const [isBulkSelecting, setIsBulkSelecting] = useState(false);

  const isPageFullySelected = useMemo(() => {
    if (currentPageData.length === 0) return false;
    return currentPageData.every(item => selectedIds.has(item.id));
  }, [currentPageData, selectedIds]); 


  const handleBulkSelect = useCallback(async (count: number) => {
    setIsBulkSelecting(true);
    try {
      const artworks = await fetchMultiplePages(count);
      bulkSelect(artworks);
    } finally {
      setIsBulkSelecting(false);
    }
  }, [fetchMultiplePages, bulkSelect]);

  const selectedArtworks = useMemo(
    () => getSelectedArtworks(artworkCache),
    [selectedIds, artworkCache, getSelectedArtworks]
  );


  const checkboxBodyTemplate = (rowData: Artwork) => (
    <Checkbox
      checked={isSelected(rowData.id)}
      onChange={() => toggleSelection(rowData.id)}
    />
  );


  const checkboxHeaderTemplate = () => (
    <div className="flex items-center">
      <Checkbox
        checked={isPageFullySelected}
        onChange={() => togglePageSelection(currentPageData, isPageFullySelected)}
      />
      <BulkSelectionOverlay
        onBulkSelect={handleBulkSelect}
        totalRecords={totalRecords}
      />
    </div>
  );

  const textBodyTemplate = (rowData: Artwork, field: keyof Artwork) => {
    const value = rowData[field];
    return (
      <span className="text-gray-700" title={value?.toString() || 'N/A'}>
        {value || 'N/A'}
      </span>
    );
  };

  const paginatorTemplate = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport',
    CurrentPageReport: (options: any) => {
      const start = options.first + 1;
      const end = Math.min(options.first + options.rows, options.totalRecords);
      return (
        <span className="text-sm text-gray-600 font-medium ml-auto">
          {start}-{end} of {options.totalRecords}
        </span>
      );
    },
  };

  const handlePageChange = (event: any) => {
    onPageChange(event.page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Art Institute of Chicago
          </h1>
          <p className="text-gray-600">Browse and select artworks from the collection</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <DataTable
            value={currentPageData}
            loading={loading || isBulkSelecting}
            paginator
            rows={ROWS_PER_PAGE}
            first={first}
            totalRecords={totalRecords}
            onPage={handlePageChange}
            lazy
            paginatorTemplate={paginatorTemplate}
            className="artwork-table"
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No artworks found"
          >
            <Column
              body={checkboxBodyTemplate}
              header={checkboxHeaderTemplate}
              style={{ width: '5rem' }}
              headerStyle={{ width: '5rem' }}
            />
            <Column
              field="title"
              header="Title"
              body={(rowData) => textBodyTemplate(rowData, 'title')}
              style={{ minWidth: '200px' }}
              sortable
            />
            <Column
              field="place_of_origin"
              header="Place of Origin"
              body={(rowData) => textBodyTemplate(rowData, 'place_of_origin')}
              style={{ minWidth: '150px' }}
            />
            <Column
              field="artist_display"
              header="Artist"
              body={(rowData) => textBodyTemplate(rowData, 'artist_display')}
              style={{ minWidth: '200px' }}
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              body={(rowData) => textBodyTemplate(rowData, 'inscriptions')}
              style={{ minWidth: '150px' }}
            />
            <Column
              field="date_start"
              header="Start Date"
              body={(rowData) => textBodyTemplate(rowData, 'date_start')}
              style={{ minWidth: '120px' }}
            />
            <Column
              field="date_end"
              header="End Date"
              body={(rowData) => textBodyTemplate(rowData, 'date_end')}
              style={{ minWidth: '120px' }}
            />
          </DataTable>
        </div>

        <SelectionPanel selectedArtworks={selectedArtworks} onRemove={removeSelection} />
      </div>
    </div>
  );
};
