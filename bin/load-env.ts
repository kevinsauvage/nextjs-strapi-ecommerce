/**
 * Loads `.env.local` (then `.env` as a fallback) into `process.env`.
 *
 * Next.js loads these files automatically, but `yarn codegen` runs through
 * `ts-node` outside Next — and the codegen configs read their credentials at
 * module-evaluation time, so this has to run before they are imported.
 * `run-codegen.ts` imports this module first for that reason.
 *
 * `.env.local` wins over `.env` because `dotenv` never overrides an already-set
 * variable, which also matches Next's precedence.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import dotenv from 'dotenv';

for (const file of ['.env.local', '.env']) {
  const path = resolve(process.cwd(), file);

  if (existsSync(path)) dotenv.config({ path });
}
