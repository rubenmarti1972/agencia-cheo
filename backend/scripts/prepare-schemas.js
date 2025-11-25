const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_API = path.join(ROOT, 'src', 'api');
const DIST_ROOT = path.join(ROOT, 'dist', 'src', 'api');

function copyContentTypeSchemas() {
  if (!fs.existsSync(SRC_API)) {
    console.warn('No src/api directory found; skipping schema copy.');
    return;
  }

  console.log('📦 Preparing content-type schemas in dist...');

  for (const apiName of fs.readdirSync(SRC_API)) {
    const contentTypesDir = path.join(SRC_API, apiName, 'content-types');
    if (!fs.existsSync(contentTypesDir)) continue;

    const distContentTypesDir = path.join(DIST_ROOT, apiName, 'content-types');
    fs.mkdirSync(distContentTypesDir, { recursive: true });

    for (const contentType of fs.readdirSync(contentTypesDir)) {
      const schemaPath = path.join(contentTypesDir, contentType, 'schema.json');
      if (!fs.existsSync(schemaPath)) continue;

      const targetDir = path.join(distContentTypesDir, contentType);
      fs.mkdirSync(targetDir, { recursive: true });
      const targetPath = path.join(targetDir, 'schema.json');

      fs.copyFileSync(schemaPath, targetPath);
      console.log(`  ✓ Copied ${apiName}/${contentType}`);
    }
  }

  console.log('✅ Schema copy completed.');
}

copyContentTypeSchemas();
