import { X } from 'lucide-react'

interface DraftIndicatorProps {
  storageKey: string
  onClear: () => void
  className?: string
}

export default function DraftIndicator({ storageKey, onClear, className = '' }: DraftIndicatorProps) {
  const savedData = localStorage.getItem(storageKey)

  if (!savedData) return null

  try {
    const parsedData = JSON.parse(savedData)
    // You could add additional logic here to check if current form data differs from saved data
    // For now, we just show the indicator if there's any saved data

    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-amber-600 text-lg">📝</div>
            <div>
              <p className="text-amber-800 font-medium">Draft Saved</p>
              <p className="text-amber-700 text-sm">Your form data is automatically saved as you type</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition"
            title="Clear saved draft"
          >
            <X className="h-4 w-4" />
            Clear Draft
          </button>
        </div>
      </div>
    )
  } catch (error) {
    // If saved data is corrupted, remove it
    localStorage.removeItem(storageKey)
    return null
  }
}
