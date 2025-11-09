#!/usr/bin/env node

/**
 * Icon Catalog Generator
 * 
 * This script ingests icons from various icon packs, normalizes their metadata,
 * and generates a unified catalog JSON file that can be used by the application.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ingestZendeskGardenIcons, LICENSE as gardenLicense } from '../src/adapters/zendesk-garden';
import { ingestFeatherIcons, LICENSE as featherLicense } from '../src/adapters/feather';
import type { IconCatalog, IconPack } from '../src/types/icon';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NODE_MODULES_PATH = path.join(PROJECT_ROOT, 'node_modules');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public', 'icon-catalog.json');

/**
 * Generate the icon catalog
 */
function generateCatalog(): IconCatalog {
  console.log('🔄 Starting icon catalog generation...\n');

  // Ingest icons from all packs
  console.log('📦 Ingesting Zendesk Garden icons...');
  const gardenIcons = ingestZendeskGardenIcons(NODE_MODULES_PATH);
  console.log(`   ✓ Found ${gardenIcons.length} Zendesk Garden icons`);

  console.log('📦 Ingesting Feather icons...');
  const featherIcons = ingestFeatherIcons(NODE_MODULES_PATH);
  console.log(`   ✓ Found ${featherIcons.length} Feather icons\n`);

  // Combine all icons
  const allIcons = [...gardenIcons, ...featherIcons];
  const totalIcons = allIcons.length;

  // Build icon index
  const icons: Record<string, typeof allIcons[0]> = {};
  const byPack: Record<IconPack, string[]> = {
    'zendesk-garden': [],
    feather: [],
  };

  for (const icon of allIcons) {
    icons[icon.id] = icon;
    byPack[icon.pack].push(icon.id);
  }

  // Generate catalog
  const catalog: IconCatalog = {
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalIcons,
    },
    licenses: {
      'zendesk-garden': gardenLicense,
      feather: featherLicense,
    },
    icons,
    byPack,
  };

  return catalog;
}

/**
 * Main execution
 */
function main() {
  try {
    // Generate catalog
    const catalog = generateCatalog();

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write catalog to file
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(catalog, null, 2),
      'utf-8'
    );

    console.log('✅ Icon catalog generated successfully!');
    console.log(`   📄 Output: ${OUTPUT_PATH}`);
    console.log(`   📊 Total icons: ${catalog.meta.totalIcons}`);
    console.log(`   📦 Zendesk Garden: ${catalog.byPack['zendesk-garden'].length}`);
    console.log(`   📦 Feather: ${catalog.byPack.feather.length}\n`);
  } catch (error) {
    console.error('❌ Error generating icon catalog:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateCatalog };

