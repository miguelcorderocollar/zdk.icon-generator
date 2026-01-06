import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: number;
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {Array.from({ length: steps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {/* Step indicator */}
            <div
              className={cn(
                "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-medium transition-colors",
                isCompleted &&
                  "border-primary bg-primary text-primary-foreground",
                isActive &&
                  "border-primary bg-background text-primary shadow-sm ring-2 ring-primary/20",
                !isCompleted &&
                  !isActive &&
                  "border-muted bg-muted text-muted-foreground"
              )}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${stepNumber}${isCompleted ? " completed" : ""}${isActive ? " active" : ""}`}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <span>{stepNumber}</span>
              )}
            </div>

            {/* Connecting line */}
            {stepNumber < steps && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 transition-colors",
                  stepNumber < currentStep ? "bg-primary" : "bg-muted"
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
