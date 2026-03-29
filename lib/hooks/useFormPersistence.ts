import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseFormPersistenceOptions {
  storageKey: string
  initialData: any
  onBeforeUnload?: boolean
  autoSaveDelay?: number
}

export function useFormPersistence<T extends Record<string, any>>({
  storageKey,
  initialData,
  onBeforeUnload = true,
  autoSaveDelay = 500
}: UseFormPersistenceOptions) {
  const router = useRouter()
  const [formData, setFormData] = useState<T>(initialData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData({ ...initialData, ...parsedData })
      } catch (error) {
        console.error('Failed to parse saved form data:', error)
        localStorage.removeItem(storageKey)
      }
    }
  }, [storageKey, initialData])

  // Save form data whenever it changes (debounced)
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem(storageKey, JSON.stringify(formData))

      // Check if we have unsaved changes
      const savedData = localStorage.getItem(storageKey)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setHasUnsavedChanges(JSON.stringify(formData) !== JSON.stringify(parsedData))
        } catch (error) {
          setHasUnsavedChanges(true)
        }
      }
    }

    const timeoutId = setTimeout(saveData, autoSaveDelay)
    return () => clearTimeout(timeoutId)
  }, [formData, storageKey, autoSaveDelay])

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    if (!onBeforeUnload) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, onBeforeUnload])

  // Clear saved data (call this after successful form submission)
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(storageKey)
    setHasUnsavedChanges(false)
  }, [storageKey])

  // Reset form to initial state and clear saved data
  const resetForm = useCallback(() => {
    setFormData(initialData)
    clearSavedData()
  }, [initialData, clearSavedData])

  return {
    formData,
    setFormData,
    hasUnsavedChanges,
    clearSavedData,
    resetForm
  }
}
