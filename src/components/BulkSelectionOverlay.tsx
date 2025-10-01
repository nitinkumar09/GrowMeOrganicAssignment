import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface BulkSelectionOverlayProps {
  onBulkSelect: (count: number) => void;
  totalRecords: number;
}

export const BulkSelectionOverlay = ({ onBulkSelect, totalRecords }: BulkSelectionOverlayProps) => {
  const [count, setCount] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);

  const handleSubmit = () => {
    if (count && count > 0) {
      const validCount = Math.min(count, totalRecords);
      onBulkSelect(validCount);
      overlayRef.current?.hide();
      setCount(null);
    }
  };

  return (
    <>
      <button
        onClick={(e) => overlayRef.current?.toggle(e)}
        className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
        aria-label="Bulk selection options"
      >
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      <OverlayPanel ref={overlayRef} className="shadow-lg">
        <div className="p-4 min-w-[250px]">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Bulk Select Rows</h3>
          <p className="text-xs text-gray-500 mb-3">
            Select a specific number of rows across pages
          </p>
          <div className="space-y-3">
            <InputNumber
              value={count}
              onValueChange={(e) => setCount(e.value ?? null)}
              placeholder="Enter number of rows"
              min={1}
              max={totalRecords}
              className="w-full"
              inputClassName="w-full p-2 border border-gray-300 rounded"
            />
            <Button
              label="Submit"
              onClick={handleSubmit}
              disabled={!count || count <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};
