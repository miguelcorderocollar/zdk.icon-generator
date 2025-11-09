/**
 * Icon Catalog Utilities
 * 
 * Client-side utilities for accessing and querying the icon catalog.
 * The catalog is loaded from /icon-catalog.json at runtime.
 */

import type { IconCatalog, IconMetadata, IconPack } from '../types/icon';

let catalogCache: IconCatalog | null = null;

/**
 * Load the icon catalog from the public directory
 */
export async function loadIconCatalog(): Promise<IconCatalog> {
  if (catalogCache) {
    return catalogCache;
  }

  try {
    const response = await fetch('/icon-catalog.json');
    if (!response.ok) {
      throw new Error(`Failed to load icon catalog: ${response.statusText}`);
    }
    catalogCache = await response.json();
    return catalogCache;
  } catch (error) {
    console.error('Error loading icon catalog:', error);
    throw error;
  }
}

/**
 * Get all icons from the catalog
 */
export async function getAllIcons(): Promise<Record<string, IconMetadata>> {
  const catalog = await loadIconCatalog();
  return catalog.icons;
}

/**
 * Get icons by pack
 */
export async function getIconsByPack(pack: IconPack): Promise<IconMetadata[]> {
  const catalog = await loadIconCatalog();
  const iconIds = catalog.byPack[pack] || [];
  return iconIds.map((id) => catalog.icons[id]).filter(Boolean);
}

/**
 * Get a single icon by ID
 */
export async function getIconById(id: string): Promise<IconMetadata | null> {
  const catalog = await loadIconCatalog();
  return catalog.icons[id] || null;
}

/**
 * Search icons by keyword
 */
export async function searchIcons(query: string): Promise<IconMetadata[]> {
  const catalog = await loadIconCatalog();
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return Object.values(catalog.icons);
  }

  return Object.values(catalog.icons).filter((icon) => {
    // Search in name
    if (icon.name.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in keywords
    if (icon.keywords.some((keyword) => keyword.includes(searchTerm))) {
      return true;
    }

    // Search in ID
    if (icon.id.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false;
  });
}

/**
 * Filter icons by pack
 */
export async function filterIconsByPack(
  icons: IconMetadata[],
  pack: IconPack
): Promise<IconMetadata[]> {
  return icons.filter((icon) => icon.pack === pack);
}

/**
 * Get icon pack license information
 */
export async function getPackLicense(pack: IconPack) {
  const catalog = await loadIconCatalog();
  return catalog.licenses[pack];
}

/**
 * Clear the catalog cache (useful for development/hot reloading)
 */
export function clearCatalogCache(): void {
  catalogCache = null;
}

