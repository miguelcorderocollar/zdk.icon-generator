/**
 * Emoji input component for adding emojis to the icon collection
 * Uses emoji-picker-react for an interactive emoji selection experience
 */

import * as React from "react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addEmoji } from "../utils/emoji-catalog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmojiInputProps {
  onEmojiAdded?: (emojiId: string) => void;
  className?: string;
}

export function EmojiInput({ onEmojiAdded, className }: EmojiInputProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleEmojiClick = async (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const metadata = await addEmoji(emoji);

      setSuccess(true);

      // Call onEmojiAdded with the metadata ID (whether new or existing)
      // This allows the parent to select it and show it in preview
      onEmojiAdded?.(metadata.id);

      // Clear success message after a delay
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add emoji");
    } finally {
      setIsProcessing(false);
    }
  };

  // Detect system theme for emoji picker
  const getTheme = (): Theme => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Theme.DARK
        : Theme.LIGHT;
    }
    return Theme.LIGHT;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-sm font-medium mb-3">Select an Emoji</h3>
        <div className="emoji-picker-wrapper rounded-lg overflow-hidden bg-card">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.LIGHT}
            searchPlaceholder="Search emojis..."
            previewConfig={{ showPreview: false }}
            width="100%"
            height={320}
            lazyLoadEmojis={true}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertDescription>Emoji added successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
