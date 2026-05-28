// Runs `vite build` for every app and reports pass/fail. Behavioral apps should
// all build; the three type-check apps still BUILD (Vite never type-checks) — use
// typecheck-all.mjs to see their by-design tsc failures.
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, folderName } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fails = [];
for (const t of TASKS) {
  for (const kind of ['Task', 'Solution']) {
    const folder = folderName(t, kind);
    try {
      execSync('npm run build', { cwd: join(root, folder), stdio: 'pipe' });
      console.log(`ok    ${folder}`);
    } catch (e) {
      fails.push(folder);
      console.log(`FAIL  ${folder}`);
    }
  }
}
console.log(fails.length ? `\n${fails.length} build failure(s): ${fails.join(', ')}` : '\nAll apps built.');
process.exit(fails.length ? 1 : 0);
