/**
 * Component for editing radial gradient properties
 */

import * as React from "react";
import { Label } from "@/components/ui/label";
import { EffectSlider } from "./EffectSlider";
import { ColorPicker } from "./ColorPicker";
import type { RadialGradient } from "@/src/utils/gradients";

export interface RadialGradientEditorProps {
  gradient: RadialGradient;
  onGradientChange: (gradient: RadialGradient) => void;
  className?: string;
}

export function RadialGradientEditor({
  gradient,
  onGradientChange,
  className,
}: RadialGradientEditorProps) {
  const handleCenterXChange = (centerX: number) => {
    onGradientChange({ ...gradient, centerX });
  };

  const handleCenterYChange = (centerY: number) => {
    onGradientChange({ ...gradient, centerY });
  };

  const handleRadiusChange = (radius: number) => {
    onGradientChange({ ...gradient, radius });
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
          id="gradient-center-x"
          label="Center X"
          value={gradient.centerX}
          onChange={handleCenterXChange}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <EffectSlider
          id="gradient-center-y"
          label="Center Y"
          value={gradient.centerY}
          onChange={handleCenterYChange}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <EffectSlider
          id="gradient-radius"
          label="Radius"
          value={gradient.radius}
          onChange={handleRadiusChange}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <div className="space-y-3">
          <Label className="text-xs">Colors</Label>
          {gradient.stops.map((stop, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[60px]">
                  {index === 0 ? "Center" : index === gradient.stops.length - 1 ? "Edge" : `Stop ${index + 1}`}
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

