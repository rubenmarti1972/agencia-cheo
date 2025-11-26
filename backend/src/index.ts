import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { bootstrapScheduler } from './cron/scheduler';

const PROJECT_ROOT = process.cwd();
const SRC_API = path.join(PROJECT_ROOT, 'src', 'api');
const DIST_API = path.join(PROJECT_ROOT, 'dist', 'src', 'api');

const copySchemasToDist = (logger?: { info: (msg: string) => void; warn: (msg: string) => void }) => {
  const log = logger ?? console;

  if (!fs.existsSync(SRC_API)) {
    log.warn(`No src/api directory found at ${SRC_API}; skipping schema sync.`);
    return;
  }

  for (const apiName of fs.readdirSync(SRC_API)) {
    const contentTypesDir = path.join(SRC_API, apiName, 'content-types');
    if (!fs.existsSync(contentTypesDir)) continue;

    for (const contentType of fs.readdirSync(contentTypesDir)) {
      const schemaPath = path.join(contentTypesDir, contentType, 'schema.json');
      if (!fs.existsSync(schemaPath)) continue;

      const targetDir = path.join(DIST_API, apiName, 'content-types', contentType);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(schemaPath, path.join(targetDir, 'schema.json'));
    }
  }

  log.info('Synced content-type schemas into dist.');
};

// Ejecutar la sincronización lo antes posible
copySchemasToDist();

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    copySchemasToDist(strapi.log);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    bootstrapScheduler(strapi);
    console.log('\n💡 Tip: Para poblar la base de datos, ejecuta: curl -X POST http://localhost:1337/api/seed/run\n');
  },
};
