// Runs `tsc --noEmit` for every app. EXPECTED result: the three -Task apps of the
// type-check topics (28, 29, 30) FAIL — making them pass is the exercise. Their
// -Solution apps and every behavioral app should type-check clean.
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, folderName } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const byDesign = new Set(TASKS.filter((t) => t.type === 'type-check').map((t) => folderName(t, 'Task')));
const unexpected = [];

for (const t of TASKS) {
  for (const kind of ['Task', 'Solution']) {
    const folder = folderName(t, kind);
    let passed = true;
    try {
      execSync('npm run typecheck', { cwd: join(root, folder), stdio: 'pipe' });
    } catch {
      passed = false;
    }
    const expectFail = byDesign.has(folder);
    const good = expectFail ? !passed : passed;
    const label = passed ? 'pass' : 'FAIL';
    const tag = expectFail ? (passed ? ' (UNEXPECTED pass — bug missing!)' : ' (fails by design ✓)') : '';
    console.log(`${good ? ' ok ' : ' !! '} ${label}  ${folder}${tag}`);
    if (!good) unexpected.push(folder);
  }
}
console.log(unexpected.length ? `\nUnexpected results: ${unexpected.join(', ')}` : '\nAll type-check results as expected.');
process.exit(unexpected.length ? 1 : 0);
