/**
 * Individual icon grid item component with selection state
 */

import * as React from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconMetadata } from "@/src/types/icon";
import { toggleFavorite, isFavorite } from "@/src/utils/local-storage";

export interface IconGridItemProps {
  icon: IconMetadata;
  isSelected?: boolean;
  onClick?: () => void;
  onFavoriteToggle?: (iconId: string, isFavorite: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function IconGridItem({
  icon,
  isSelected = false,
  onClick,
  onFavoriteToggle,
  className,
  style,
}: IconGridItemProps) {
  // Initialize as false to avoid hydration mismatch (localStorage only available client-side)
  const [isFavorited, setIsFavorited] = React.useState(false);
  
  // Update favorite status after mount to avoid hydration mismatch
  React.useEffect(() => {
    setIsFavorited(isFavorite(icon.id));
  }, [icon.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = toggleFavorite(icon.id);
    setIsFavorited(newFavoriteState);
    onFavoriteToggle?.(icon.id, newFavoriteState);
  };

  // Lazy load SVG - only render when visible
  const [isVisible, setIsVisible] = React.useState(false);
  const itemRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!itemRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" } // Start loading slightly before visible
    );

    observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  // Render SVG icon - preserve original structure completely
  const svgContent = React.useMemo(() => {
    if (!isVisible) return null;
    
    try {
      // Parse SVG and only modify size attributes, preserve everything else
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(icon.svg, "image/svg+xml");
      const svgElement = svgDoc.querySelector("svg");
      if (!svgElement) return null;

      // Only set size attributes, preserve all original fill/stroke/colors
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
      svgElement.setAttribute("class", "icon-svg");
      svgElement.setAttribute("style", "display: block;");

      // Don't modify fill/stroke - preserve original SVG structure
      // The SVGs already use currentColor where appropriate

      return svgElement.outerHTML;
    } catch (error) {
      console.error("Error parsing SVG:", error);
      return null;
    }
  }, [icon.svg, isVisible]);

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={onClick}
      style={style}
      className={cn(
        "group relative flex aspect-square items-center justify-center rounded-md border-2 transition-all",
        "bg-muted/50 hover:bg-muted hover:border-primary/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected && "border-primary bg-primary/10 shadow-sm",
        className
      )}
      aria-label={`Select icon: ${icon.name}`}
    >
      {/* SVG Icon */}
      {svgContent ? (
        <div
          className="flex h-full w-full items-center justify-center p-2 [&_svg]:w-full [&_svg]:h-full text-foreground"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-2 text-foreground">
          <span className="text-xs text-muted-foreground">{icon.name}</span>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute right-1 top-1 rounded-full bg-primary p-0.5">
          <Check className="size-2.5 text-primary-foreground" />
        </div>
      )}

      {/* Favorite button */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleFavoriteClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleFavoriteClick(e as any);
          }
        }}
        className={cn(
          "absolute left-1 top-1 rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer",
          "hover:bg-muted focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isFavorited && "opacity-100"
        )}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Star
          className={cn(
            "size-3 transition-colors",
            isFavorited
              ? "fill-yellow-500 text-yellow-500"
              : "text-muted-foreground hover:text-yellow-500"
          )}
        />
      </div>

      {/* Tooltip with icon name on hover */}
      <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black/80 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-[10px] text-white truncate block">{icon.name}</span>
      </div>
    </button>
  );
}

