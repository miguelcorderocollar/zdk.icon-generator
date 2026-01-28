/**
 * Style preset editor modal for creating and editing style presets
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackgroundControls } from "./BackgroundControls";
import { ColorPicker } from "./ColorPicker";
import type { StylePreset } from "@/src/types/preset";
import type { BackgroundValue } from "@/src/utils/gradients";
import { KALE_COLORS } from "@/src/utils/gradients";

export interface StylePresetEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset?: StylePreset;
  onSave: (preset: Omit<StylePreset, "id" | "isBuiltIn" | "createdAt">) => void;
  mode?: "create" | "edit";
}

const DEFAULT_BACKGROUND = KALE_COLORS["900"];
const DEFAULT_ICON_COLOR = "#ffffff";

export function StylePresetEditor({
  open,
  onOpenChange,
  preset,
  onSave,
  mode = "create",
}: StylePresetEditorProps) {
  const [name, setName] = React.useState(preset?.name || "");
  const [backgroundColor, setBackgroundColor] = React.useState<BackgroundValue>(
    preset?.backgroundColor || DEFAULT_BACKGROUND
  );
  const [iconColor, setIconColor] = React.useState(
    preset?.iconColor || DEFAULT_ICON_COLOR
  );

  // Reset form when preset changes
  React.useEffect(() => {
    if (preset) {
      setName(preset.name);
      setBackgroundColor(preset.backgroundColor);
      setIconColor(preset.iconColor);
    } else {
      setName("");
      setBackgroundColor(DEFAULT_BACKGROUND);
      setIconColor(DEFAULT_ICON_COLOR);
    }
  }, [preset, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      backgroundColor,
      iconColor,
    });

    onOpenChange(false);
  };

  const isValid = name.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Create Style Preset" : "Edit Style Preset"}
          </DialogTitle>
          <DialogDescription>
            Define a reusable color scheme for your icons.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4 pr-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="style-name">Preset Name</Label>
              <Input
                id="style-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Style"
              />
            </div>

            <Separator />

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <StylePreview
                backgroundColor={backgroundColor}
                iconColor={iconColor}
              />
            </div>

            <Separator />

            {/* Background */}
            <BackgroundControls
              value={backgroundColor}
              onChange={setBackgroundColor}
            />

            <Separator />

            {/* Icon Color */}
            <ColorPicker
              id="icon-color"
              label="Icon Color"
              value={iconColor}
              onChange={setIconColor}
              colorType="icon"
            />
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {mode === "create" ? "Create Style" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface StylePreviewProps {
  backgroundColor: BackgroundValue;
  iconColor: string;
}

function StylePreview({ backgroundColor, iconColor }: StylePreviewProps) {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (typeof backgroundColor === "string") {
      return { backgroundColor };
    }

    // Gradient
    if (backgroundColor.type === "linear") {
      const stops = backgroundColor.stops
        .map((s) => `${s.color} ${s.offset}%`)
        .join(", ");
      return {
        background: `linear-gradient(${backgroundColor.angle}deg, ${stops})`,
      };
    } else {
      const stops = backgroundColor.stops
        .map((s) => `${s.color} ${s.offset}%`)
        .join(", ");
      return {
        background: `radial-gradient(circle ${backgroundColor.radius}% at ${backgroundColor.centerX}% ${backgroundColor.centerY}%, ${stops})`,
      };
    }
  };

  return (
    <div
      className="h-24 rounded-lg border flex items-center justify-center"
      style={getBackgroundStyle()}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-12 w-12"
        fill={iconColor}
        stroke="none"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}
