import * as React from "react";
import {
  Sparkles,
  Palette,
  Settings,
  Download,
  Zap,
  Lock,
  Clock,
  CheckCircle,
  Package,
  Feather,
  Grid3x3,
  Smile,
  Upload,
  MapPin,
  Layers,
  Pipette,
  Maximize,
  Eye,
  FileImage,
  FileType,
  FolderArchive,
  ShieldCheck,
  FolderCheck,
  type LucideIcon,
} from "lucide-react";
import { KALE_COLORS } from "@/src/utils/gradients";

interface Feature {
  text: string;
  icon: LucideIcon;
}

interface StepContentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: Feature[];
}

function StepContent({
  icon: Icon,
  title,
  description,
  features,
}: StepContentProps) {
  return (
    <div className="flex flex-col items-center space-y-6 py-4 text-center animate-in fade-in duration-300">
      <div
        className="rounded-full p-5 shadow-xl ring-1 ring-white/10 transition-transform hover:scale-105"
        style={{ backgroundColor: KALE_COLORS["900"] }}
      >
        <Icon className="h-14 w-14 text-white" strokeWidth={1.5} />
      </div>
      <div className="space-y-2 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <ul className="w-full max-w-xl space-y-3 text-left px-4 sm:px-6">
        {features.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-foreground/90 group"
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md shadow-sm ring-1 ring-white/10 transition-all group-hover:scale-110 group-hover:shadow-md"
                style={{ backgroundColor: KALE_COLORS["700"] }}
              >
                <FeatureIcon
                  className="h-3.5 w-3.5 text-white"
                  strokeWidth={2}
                />
              </span>
              <span className="flex-1 leading-relaxed">{feature.text}</span>
            </li>
          );
        })}
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
      {
        text: "Create compliant icon sets for Zendesk apps in minutes",
        icon: Zap,
      },
      {
        text: "All processing happens locally - no account or upload needed",
        icon: Lock,
      },
      { text: "Save time with automated sizing and naming", icon: Clock },
      {
        text: "Ensure compliance with Zendesk's icon requirements",
        icon: CheckCircle,
      },
    ],
  },
  {
    icon: Palette,
    title: "Choose from Multiple Icon Sources",
    description:
      "Access a curated collection of icon packs, all with permissive licenses.",
    features: [
      {
        text: "Zendesk Garden - Official Zendesk design system icons",
        icon: Package,
      },
      {
        text: "Feather Icons - Minimal, clean, and consistent icon set",
        icon: Feather,
      },
      { text: "RemixIcon - Modern, comprehensive icon library", icon: Grid3x3 },
      { text: "Emoji - Quick and expressive emoji icons", icon: Smile },
      {
        text: "Custom SVG/Image - Upload and use your own designs",
        icon: Upload,
      },
    ],
  },
  {
    icon: Settings,
    title: "Customize for Your Zendesk App",
    description:
      "Fine-tune your icons with real-time previews and flexible options.",
    features: [
      {
        text: "Select app locations: Support, Chat, Talk, Nav Bar, Top Bar, Ticket Editor",
        icon: MapPin,
      },
      {
        text: "Choose background styles: Solid colors, linear gradients, radial gradients",
        icon: Layers,
      },
      {
        text: "Adjust icon colors with full color picker and history",
        icon: Pipette,
      },
      {
        text: "Control icon sizing for both PNG and SVG exports",
        icon: Maximize,
      },
      { text: "Preview all variants in real-time before exporting", icon: Eye },
    ],
  },
  {
    icon: Download,
    title: "Export Compliant Icon Bundles",
    description:
      "Download a ZIP file with all required assets, properly sized and named.",
    features: [
      {
        text: "PNG assets: logo.png (320×320) and logo-small.png (128×128)",
        icon: FileImage,
      },
      {
        text: "SVG assets: Location-specific icons with transparent backgrounds",
        icon: FileType,
      },
      {
        text: "One-click ZIP download with correct file structure",
        icon: FolderArchive,
      },
      {
        text: "Built-in validation for colors, locations, and compliance",
        icon: ShieldCheck,
      },
      {
        text: "Ready to add directly to your Zendesk app project",
        icon: FolderCheck,
      },
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
