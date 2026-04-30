import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

if (typeof process.loadEnvFile === 'function') {
  const rootEnvPath = resolve(process.cwd(), '.env');
  const localEnvPath = resolve(process.cwd(), '.env.local');

  if (existsSync(rootEnvPath)) {
    process.loadEnvFile(rootEnvPath);
  }

  if (existsSync(localEnvPath)) {
    process.loadEnvFile(localEnvPath);
  }
}

const rootDir = process.cwd();
const enginePublicDir = resolve(rootDir, 'public');

function resolveDefaultContentRoot() {
  const localContentRoot = resolve(rootDir, 'content');
  const localBlogDir = resolve(localContentRoot, 'blog');

  return existsSync(localBlogDir) ? localContentRoot : undefined;
}

function resolveExternalPublicDir() {
  const configuredExternalPublicDir = process.env.BLOG_PUBLIC_DIR;
  const configuredContentRoot = process.env.BLOG_CONTENT_ROOT;
  const defaultContentRoot = resolveDefaultContentRoot();

  if (configuredExternalPublicDir) {
    return resolve(rootDir, configuredExternalPublicDir);
  }

  if (configuredContentRoot) {
    return resolve(rootDir, configuredContentRoot, 'public');
  }

  if (defaultContentRoot) {
    const defaultPublicDir = resolve(defaultContentRoot, 'public');

    return existsSync(defaultPublicDir) ? defaultPublicDir : undefined;
  }

  return undefined;
}

function resolveGeneratedPublicDir() {
  const publicSourceDir = resolveExternalPublicDir() ?? 'engine-public';
  const key = createHash('sha1').update(publicSourceDir).digest('hex').slice(0, 12);

  return resolve(rootDir, '.generated/public', key);
}

const externalPublicDir = resolveExternalPublicDir();
const generatedPublicDir = resolveGeneratedPublicDir();

rmSync(generatedPublicDir, { recursive: true, force: true });
mkdirSync(generatedPublicDir, { recursive: true });

if (existsSync(enginePublicDir)) {
  cpSync(enginePublicDir, generatedPublicDir, { recursive: true });
}

if (externalPublicDir) {
  if (!existsSync(externalPublicDir)) {
    throw new Error(`Configured public assets directory does not exist: ${externalPublicDir}`);
  }

  cpSync(externalPublicDir, generatedPublicDir, { recursive: true, force: true });
}

console.log(`Prepared public assets in ${generatedPublicDir}`);