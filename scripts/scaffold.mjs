// Generates the per-app boilerplate (package.json, index.html, vite.config.ts,
// tsconfig.json, src/main.tsx) for every Task/Solution folder from the manifest.
// It is idempotent and NEVER overwrites an existing src/App.tsx (the real content).
// Run from the repo root:  node scripts/scaffold.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, folderName } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const pkgJson = (folder) => JSON.stringify({
  name: folder.toLowerCase(),
  private: true,
  version: '1.0.0',
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview', typecheck: 'tsc --noEmit' },
}, null, 2) + '\n';

const indexHtml = (title) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const viteConfig = `// Re-exports the repo-root shared config so all 60 apps share ONE config + ONE dependency set.
export { default } from '../vite.config.shared';
`;

const tsConfig = JSON.stringify({ extends: '../tsconfig.base.json', include: ['src'] }, null, 2) + '\n';

const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const placeholderApp = (title) => `export default function App() {
  return <h1>${title} — App.tsx not authored yet</h1>;
}
`;

let made = 0;
for (const t of TASKS) {
  for (const kind of ['Task', 'Solution']) {
    const folder = folderName(t, kind);
    const dir = join(root, folder);
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });

    const title = `${t.num} ${t.title} — ${kind}`;
    writeFileSync(join(dir, 'package.json'), pkgJson(folder));
    writeFileSync(join(dir, 'index.html'), indexHtml(title));
    writeFileSync(join(dir, 'vite.config.ts'), viteConfig);
    writeFileSync(join(dir, 'tsconfig.json'), tsConfig);
    writeFileSync(join(src, 'main.tsx'), mainTsx);

    const appPath = join(src, 'App.tsx');
    if (!existsSync(appPath)) writeFileSync(appPath, placeholderApp(title));
    made++;
  }
}
console.log(`Scaffolded ${made} app folders (App.tsx preserved where present).`);
