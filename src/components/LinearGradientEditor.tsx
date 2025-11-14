/**
 * Component for editing linear gradient properties
 */

import * as React from "react";
import { Label } from "@/components/ui/label";
import { EffectSlider } from "./EffectSlider";
import { ColorPicker } from "./ColorPicker";
import type { LinearGradient } from "@/src/utils/gradients";

export interface LinearGradientEditorProps {
  gradient: LinearGradient;
  onGradientChange: (gradient: LinearGradient) => void;
  className?: string;
}

export function LinearGradientEditor({
  gradient,
  onGradientChange,
  className,
}: LinearGradientEditorProps) {
  const handleAngleChange = (angle: number) => {
    onGradientChange({ ...gradient, angle });
  };

  const handleStopColorChange = (index: number, color: string) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], color };
    onGradientChange({ ...gradient, stops: newStops });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <EffectSlider
          id="gradient-angle"
          label="Angle"
          value={gradient.angle}
          onChange={handleAngleChange}
          min={0}
          max={360}
          step={1}
          unit="°"
        />

        <div className="space-y-3">
          <Label className="text-xs">Colors</Label>
          {gradient.stops.map((stop, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[60px]">
                  {index === 0 ? "From" : index === gradient.stops.length - 1 ? "To" : `Stop ${index + 1}`}
                </span>
                <ColorPicker
                  id={`gradient-stop-${index}`}
                  label=""
                  value={stop.color}
                  onChange={(color) => handleStopColorChange(index, color)}
                  colorType="background"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

