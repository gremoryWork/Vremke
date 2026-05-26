/**
 * Сборка для GitHub Pages с правильным base path.
 * Пример: npm run build:pages -- vremke-portfolio
 */
import { execSync } from 'node:child_process';

const repo = process.argv[2];

if (!repo) {
  console.error('\n❌ Укажите имя репозитория GitHub:\n');
  console.error('   npm run build:pages -- vremke-portfolio\n');
  process.exit(1);
}

const base = repo.startsWith('/') ? repo : `/${repo}/`;
process.env.VITE_BASE_PATH = base;

console.log(`\n📦 Сборка для GitHub Pages (base: ${base})\n`);

execSync('npm run build', { stdio: 'inherit', env: { ...process.env, VITE_BASE_PATH: base } });

console.log('\n✅ Готово. Папка dist/ — загружайте на хостинг.\n');
