"use client";

/**
 * CanvasControlsPane - Source selector + Presets + Background controls for canvas mode
 */

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Library,
  Layers,
  Smile,
  Upload,
  Image as ImageIcon,
  PenTool,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { BackgroundControls } from "./BackgroundControls";
import { ExportPresetSelector } from "./ExportPresetSelector";
import { ExportPresetEditor } from "./ExportPresetEditor";
import { StylePresetSelector } from "./StylePresetSelector";
import { StylePresetEditor } from "./StylePresetEditor";
import { PresetSettingsModal } from "./PresetSettingsModal";
import { usePresets } from "@/src/hooks/use-presets";
import { ICON_PACKS, type IconPack } from "@/src/constants/app";
import type { BackgroundValue } from "@/src/utils/gradients";
import type { ExportPreset, StylePreset } from "@/src/types/preset";

interface CanvasControlsPaneProps {
  selectedPack: IconPack;
  onPackChange: (pack: IconPack) => void;
  backgroundColor: BackgroundValue;
  onBackgroundColorChange: (color: BackgroundValue) => void;
  /** Callback to apply icon color to all icon/text layers */
  onApplyIconColor?: (color: string) => void;
}

export function CanvasControlsPane({
  selectedPack,
  onPackChange,
  backgroundColor,
  onBackgroundColorChange,
  onApplyIconColor,
}: CanvasControlsPaneProps) {
  // Presets hook
  const {
    exportPresets,
    selectedExportPresetId,
    selectedExportPreset,
    selectExportPreset,
    createExportPreset,
    updateExportPreset,
    deleteExportPreset,
    stylePresets,
    selectedStylePresetId,
    selectStylePreset,
    createStylePreset,
    updateStylePreset,
    deleteStylePreset,
    exportAllPresets,
    importPresets,
    clearCustomPresets,
    hasCustomExportPresets,
    hasCustomStylePresets,
  } = usePresets();

  // Export preset editor state
  const [showExportEditor, setShowExportEditor] = React.useState(false);
  const [editingExportPreset, setEditingExportPreset] = React.useState<
    ExportPreset | undefined
  >();

  // Style preset editor state
  const [showStyleEditor, setShowStyleEditor] = React.useState(false);
  const [editingStylePreset, setEditingStylePreset] = React.useState<
    StylePreset | undefined
  >();

  // Check if selected export preset has SVG variants (canvas doesn't support SVG)
  const hasSvgVariants = React.useMemo(() => {
    if (!selectedExportPreset) return false;
    return selectedExportPreset.variants.some((v) => v.format === "svg");
  }, [selectedExportPreset]);

  // Handle applying a style preset
  const handleApplyStylePreset = React.useCallback(
    (preset: StylePreset) => {
      onBackgroundColorChange(preset.backgroundColor);
      // Apply icon color to canvas layers
      if (onApplyIconColor) {
        onApplyIconColor(preset.iconColor);
      }
    },
    [onBackgroundColorChange, onApplyIconColor]
  );

  // Export preset handlers
  const handleCreateExportPreset = () => {
    setEditingExportPreset(undefined);
    setShowExportEditor(true);
  };

  const handleEditExportPreset = (preset: ExportPreset) => {
    setEditingExportPreset(preset);
    setShowExportEditor(true);
  };

  const handleSaveExportPreset = (
    preset: Omit<ExportPreset, "id" | "isBuiltIn" | "createdAt">
  ) => {
    if (editingExportPreset) {
      updateExportPreset(editingExportPreset.id, preset);
    } else {
      const newPreset = createExportPreset(preset);
      selectExportPreset(newPreset.id);
    }
  };

  // Style preset handlers
  const handleCreateStylePreset = () => {
    setEditingStylePreset(undefined);
    setShowStyleEditor(true);
  };

  const handleEditStylePreset = (preset: StylePreset) => {
    setEditingStylePreset(preset);
    setShowStyleEditor(true);
  };

  const handleSaveStylePreset = (
    preset: Omit<StylePreset, "id" | "isBuiltIn" | "createdAt">
  ) => {
    if (editingStylePreset) {
      updateStylePreset(editingStylePreset.id, preset);
    } else {
      const newPreset = createStylePreset(preset);
      selectStylePreset(newPreset.id);
      handleApplyStylePreset(newPreset as StylePreset);
    }
  };

  const handlePackChange = (value: string) => {
    onPackChange(value as IconPack);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Controls</CardTitle>
        <PresetSettingsModal
          exportPresets={exportPresets}
          stylePresets={stylePresets}
          onCreateExportPreset={createExportPreset}
          onUpdateExportPreset={updateExportPreset}
          onDeleteExportPreset={deleteExportPreset}
          onCreateStylePreset={createStylePreset}
          onUpdateStylePreset={updateStylePreset}
          onDeleteStylePreset={deleteStylePreset}
          onExportPresets={exportAllPresets}
          onImportPresets={importPresets}
          onClearPresets={clearCustomPresets}
          hasCustomPresets={hasCustomExportPresets || hasCustomStylePresets}
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {/* Source Selector */}
        <div className="space-y-2">
          <Label htmlFor="source-select">Source</Label>
          <Select value={selectedPack} onValueChange={handlePackChange}>
            <SelectTrigger id="source-select" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ICON_PACKS.ALL}>
                <span className="flex items-center gap-2">
                  <Layers className="size-4" />
                  All Icons
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.GARDEN}>
                <span className="flex items-center gap-2">
                  <Library className="size-4" />
                  Garden
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.FEATHER}>
                <span className="flex items-center gap-2">
                  <Library className="size-4" />
                  Feather
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.REMIXICON}>
                <span className="flex items-center gap-2">
                  <Library className="size-4" />
                  RemixIcon
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.EMOJI}>
                <span className="flex items-center gap-2">
                  <Smile className="size-4" />
                  Emoji
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.CUSTOM_SVG}>
                <span className="flex items-center gap-2">
                  <Upload className="size-4" />
                  Custom SVG
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.CUSTOM_IMAGE}>
                <span className="flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Custom Image
                </span>
              </SelectItem>
              <SelectItem value={ICON_PACKS.CANVAS}>
                <span className="flex items-center gap-2">
                  <PenTool className="size-4" />
                  Canvas Editor
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select a different source to exit canvas mode.
          </p>
        </div>

        <Separator />

        {/* Export Preset Selection */}
        <ExportPresetSelector
          presets={exportPresets}
          selectedPresetId={selectedExportPresetId}
          onSelectPreset={selectExportPreset}
          onCreatePreset={handleCreateExportPreset}
          onEditPreset={handleEditExportPreset}
          onDeletePreset={deleteExportPreset}
        />

        {/* SVG Warning for Canvas Mode */}
        {hasSvgVariants && (
          <Alert
            variant="default"
            className="border-amber-500/50 bg-amber-500/10"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs">
              Canvas mode only exports raster formats. SVG files in this preset
              will be skipped.
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Style Preset Selection */}
        <StylePresetSelector
          presets={stylePresets}
          selectedPresetId={selectedStylePresetId}
          onSelectPreset={selectStylePreset}
          onApplyPreset={handleApplyStylePreset}
          onCreatePreset={handleCreateStylePreset}
          onEditPreset={handleEditStylePreset}
          onDeletePreset={deleteStylePreset}
        />

        <Separator />

        {/* Background Controls */}
        <BackgroundControls
          value={backgroundColor}
          onChange={onBackgroundColorChange}
        />
      </CardContent>

      {/* Export Preset Editor Modal */}
      <ExportPresetEditor
        open={showExportEditor}
        onOpenChange={setShowExportEditor}
        preset={editingExportPreset}
        onSave={handleSaveExportPreset}
        mode={editingExportPreset ? "edit" : "create"}
      />

      {/* Style Preset Editor Modal */}
      <StylePresetEditor
        open={showStyleEditor}
        onOpenChange={setShowStyleEditor}
        preset={editingStylePreset}
        onSave={handleSaveStylePreset}
        mode={editingStylePreset ? "edit" : "create"}
      />
    </Card>
  );
}
