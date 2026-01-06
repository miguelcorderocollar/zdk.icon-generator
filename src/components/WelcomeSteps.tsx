import * as React from "react";
import {
  Sparkles,
  Palette,
  Settings,
  Download,
  type LucideIcon,
} from "lucide-react";
import { KALE_COLORS } from "@/src/utils/gradients";

interface StepContentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

function StepContent({
  icon: Icon,
  title,
  description,
  features,
}: StepContentProps) {
  return (
    <div className="flex flex-col items-center space-y-6 py-4 text-center">
      <div
        className="rounded-full p-5 shadow-lg"
        style={{ backgroundColor: KALE_COLORS["900"] }}
      >
        <Icon className="h-14 w-14 text-white" strokeWidth={1.5} />
      </div>
      <div className="space-y-2 px-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="w-full space-y-2.5 text-left px-4 sm:px-6">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-sm text-muted-foreground"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: KALE_COLORS["700"] }}
            >
              •
            </span>
            <span className="flex-1">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const WELCOME_STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to Zendesk App Icon Generator",
    description:
      "Generate compliant Zendesk app icon bundles quickly and easily, all in your browser.",
    features: [
      "Create compliant icon sets for Zendesk apps in minutes",
      "All processing happens locally - no account or upload needed",
      "Save time with automated sizing and naming",
      "Ensure compliance with Zendesk's icon requirements",
    ],
  },
  {
    icon: Palette,
    title: "Choose from Multiple Icon Sources",
    description:
      "Access a curated collection of icon packs, all with permissive licenses.",
    features: [
      "Zendesk Garden - Official Zendesk design system icons",
      "Feather Icons - Minimal, clean, and consistent icon set",
      "RemixIcon - Modern, comprehensive icon library",
      "Emoji - Quick and expressive emoji icons",
      "Custom SVG/Image - Upload and use your own designs",
    ],
  },
  {
    icon: Settings,
    title: "Customize for Your Zendesk App",
    description:
      "Fine-tune your icons with real-time previews and flexible options.",
    features: [
      "Select app locations: Support, Chat, Talk, Nav Bar, Top Bar, Ticket Editor",
      "Choose background styles: Solid colors, linear gradients, radial gradients",
      "Adjust icon colors with full color picker and history",
      "Control icon sizing for both PNG and SVG exports",
      "Preview all variants in real-time before exporting",
    ],
  },
  {
    icon: Download,
    title: "Export Compliant Icon Bundles",
    description:
      "Download a ZIP file with all required assets, properly sized and named.",
    features: [
      "PNG assets: logo.png (320×320) and logo-small.png (128×128)",
      "SVG assets: Location-specific icons with transparent backgrounds",
      "One-click ZIP download with correct file structure",
      "Built-in validation for colors, locations, and compliance",
      "Ready to add directly to your Zendesk app project",
    ],
  },
];

interface WelcomeStepProps {
  stepIndex: number;
}

export function WelcomeStep({ stepIndex }: WelcomeStepProps) {
  const step = WELCOME_STEPS[stepIndex];

  if (!step) {
    return null;
  }

  return <StepContent {...step} />;
}
