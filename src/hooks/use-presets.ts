/**
 * Hook for managing export and style presets
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import type {
  ExportPreset,
  StylePreset,
  PresetImportResult,
} from "@/src/types/preset";
import {
  getAllExportPresets,
  getAllStylePresets,
  getSelectedExportPresetId,
  getSelectedStylePresetId,
  setSelectedExportPresetId,
  setSelectedStylePresetId,
  addExportPreset,
  updateExportPreset,
  deleteExportPreset,
  addStylePreset,
  updateStylePreset,
  deleteStylePreset,
  downloadPresetsFile,
  importPresetsFromFile,
  clearAllCustomPresets,
  getCustomExportPresets,
  getCustomStylePresets,
} from "@/src/utils/preset-storage";
import { DEFAULT_EXPORT_PRESET_ID } from "@/src/utils/builtin-presets";

/**
 * Return type for the usePresets hook
 */
export interface UsePresetsReturn {
  // Export presets
  exportPresets: ExportPreset[];
  selectedExportPresetId: string;
  selectedExportPreset: ExportPreset | undefined;
  selectExportPreset: (id: string) => void;
  createExportPreset: (
    preset: Omit<ExportPreset, "id" | "isBuiltIn" | "createdAt">
  ) => ExportPreset;
  updateExportPreset: (
    id: string,
    updates: Partial<Omit<ExportPreset, "id" | "isBuiltIn">>
  ) => void;
  deleteExportPreset: (id: string) => boolean;
  hasCustomExportPresets: boolean;

  // Style presets
  stylePresets: StylePreset[];
  selectedStylePresetId: string | null;
  selectedStylePreset: StylePreset | undefined;
  selectStylePreset: (id: string | null) => void;
  createStylePreset: (
    preset: Omit<StylePreset, "id" | "isBuiltIn" | "createdAt">
  ) => StylePreset;
  updateStylePreset: (
    id: string,
    updates: Partial<Omit<StylePreset, "id" | "isBuiltIn">>
  ) => void;
  deleteStylePreset: (id: string) => boolean;
  hasCustomStylePresets: boolean;

  // Import/Export
  exportAllPresets: () => void;
  importPresets: (file: File) => Promise<PresetImportResult>;
  clearCustomPresets: () => void;

  // State
  isLoading: boolean;
}

/**
 * Hook for managing export and style presets
 */
export function usePresets(): UsePresetsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [exportPresets, setExportPresets] = useState<ExportPreset[]>([]);
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([]);
  const [selectedExportPresetId, setSelectedExportPresetIdState] =
    useState<string>(DEFAULT_EXPORT_PRESET_ID);
  const [selectedStylePresetId, setSelectedStylePresetIdState] = useState<
    string | null
  >(null);

  // Load presets on mount
  useEffect(() => {
    const loadPresets = () => {
      setExportPresets(getAllExportPresets());
      setStylePresets(getAllStylePresets());
      setSelectedExportPresetIdState(getSelectedExportPresetId());
      setSelectedStylePresetIdState(getSelectedStylePresetId());
      setIsLoading(false);
    };
    loadPresets();
  }, []);

  // Refresh presets from storage
  const refreshPresets = useCallback(() => {
    setExportPresets(getAllExportPresets());
    setStylePresets(getAllStylePresets());
  }, []);

  // Export preset operations
  const selectExportPreset = useCallback((id: string) => {
    setSelectedExportPresetId(id);
    setSelectedExportPresetIdState(id);
  }, []);

  const handleCreateExportPreset = useCallback(
    (preset: Omit<ExportPreset, "id" | "isBuiltIn" | "createdAt">) => {
      const newPreset = addExportPreset(preset);
      refreshPresets();
      return newPreset;
    },
    [refreshPresets]
  );

  const handleUpdateExportPreset = useCallback(
    (id: string, updates: Partial<Omit<ExportPreset, "id" | "isBuiltIn">>) => {
      updateExportPreset(id, updates);
      refreshPresets();
    },
    [refreshPresets]
  );

  const handleDeleteExportPreset = useCallback(
    (id: string) => {
      const result = deleteExportPreset(id);
      if (result) {
        refreshPresets();
        // Update selected preset if needed
        if (selectedExportPresetId === id) {
          setSelectedExportPresetIdState(DEFAULT_EXPORT_PRESET_ID);
        }
      }
      return result;
    },
    [refreshPresets, selectedExportPresetId]
  );

  // Style preset operations
  const selectStylePreset = useCallback((id: string | null) => {
    setSelectedStylePresetId(id);
    setSelectedStylePresetIdState(id);
  }, []);

  const handleCreateStylePreset = useCallback(
    (preset: Omit<StylePreset, "id" | "isBuiltIn" | "createdAt">) => {
      const newPreset = addStylePreset(preset);
      refreshPresets();
      return newPreset;
    },
    [refreshPresets]
  );

  const handleUpdateStylePreset = useCallback(
    (id: string, updates: Partial<Omit<StylePreset, "id" | "isBuiltIn">>) => {
      updateStylePreset(id, updates);
      refreshPresets();
    },
    [refreshPresets]
  );

  const handleDeleteStylePreset = useCallback(
    (id: string) => {
      const result = deleteStylePreset(id);
      if (result) {
        refreshPresets();
        // Update selected preset if needed
        if (selectedStylePresetId === id) {
          setSelectedStylePresetIdState(null);
        }
      }
      return result;
    },
    [refreshPresets, selectedStylePresetId]
  );

  // Import/Export operations
  const exportAllPresets = useCallback(() => {
    downloadPresetsFile();
  }, []);

  const importPresets = useCallback(
    async (file: File): Promise<PresetImportResult> => {
      const result = await importPresetsFromFile(file);
      if (result.success) {
        refreshPresets();
      }
      return result;
    },
    [refreshPresets]
  );

  const clearCustomPresets = useCallback(() => {
    clearAllCustomPresets();
    refreshPresets();
    setSelectedExportPresetIdState(DEFAULT_EXPORT_PRESET_ID);
    setSelectedStylePresetIdState(null);
  }, [refreshPresets]);

  // Computed values - derived from state for reactivity
  const selectedExportPreset = useMemo(
    () => exportPresets.find((p) => p.id === selectedExportPresetId),
    [exportPresets, selectedExportPresetId]
  );

  const selectedStylePreset = useMemo(
    () =>
      selectedStylePresetId
        ? stylePresets.find((p) => p.id === selectedStylePresetId)
        : undefined,
    [stylePresets, selectedStylePresetId]
  );

  const hasCustomExportPresets = useMemo(
    () => getCustomExportPresets().length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exportPresets]
  );

  const hasCustomStylePresets = useMemo(
    () => getCustomStylePresets().length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stylePresets]
  );

  return {
    // Export presets
    exportPresets,
    selectedExportPresetId,
    selectedExportPreset,
    selectExportPreset,
    createExportPreset: handleCreateExportPreset,
    updateExportPreset: handleUpdateExportPreset,
    deleteExportPreset: handleDeleteExportPreset,
    hasCustomExportPresets,

    // Style presets
    stylePresets,
    selectedStylePresetId,
    selectedStylePreset,
    selectStylePreset,
    createStylePreset: handleCreateStylePreset,
    updateStylePreset: handleUpdateStylePreset,
    deleteStylePreset: handleDeleteStylePreset,
    hasCustomStylePresets,

    // Import/Export
    exportAllPresets,
    importPresets,
    clearCustomPresets,

    // State
    isLoading,
  };
}
