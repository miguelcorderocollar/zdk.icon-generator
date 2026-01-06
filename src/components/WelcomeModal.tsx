"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Stepper } from "./Stepper";
import { WelcomeStep, WELCOME_STEPS } from "./WelcomeSteps";
import { markWelcomeSeen } from "@/src/utils/local-storage";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = WELCOME_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = (markSeen = true) => {
    if (markSeen) {
      markWelcomeSeen();
    }
    onOpenChange(false);
    // Reset to first step for next time
    setTimeout(() => setCurrentStep(1), 300);
  };

  const handleGetStarted = () => {
    handleClose(true);
  };

  const handleSkip = () => {
    handleClose(true);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowRight" && !isLastStep) {
      handleNext();
    } else if (e.key === "ArrowLeft" && !isFirstStep) {
      handlePrevious();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStep]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => handleClose(!isOpen)}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col gap-4"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="sr-only">Welcome Guide</DialogTitle>
          <div className="pt-2 sm:pt-4">
            <Stepper steps={totalSteps} currentStep={currentStep} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-[350px] sm:min-h-[400px] -mx-6 px-6">
          <WelcomeStep stepIndex={currentStep - 1} />
        </div>

        <DialogFooter className="shrink-0 flex-col gap-3 sm:flex-row sm:justify-between sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="order-2 sm:order-1"
          >
            Skip
          </Button>

          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex-1 sm:flex-none"
            >
              Previous
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleGetStarted}
                className="flex-1 sm:flex-none"
              >
                Get Started
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1 sm:flex-none">
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
