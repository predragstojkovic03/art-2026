import { execSync } from 'child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const puppeteerConfig = resolve(__dirname, 'puppeteer-config.json');
const mmdc = resolve(__dirname, '../node_modules/.bin/mmdc');
const mdToPdf = resolve(__dirname, '../node_modules/.bin/md-to-pdf');

const tmp = mkdtempSync(join(tmpdir(), 'art2026-pdf-'));
try {
  // Render mermaid blocks to SVG files in temp dir
  execSync(
    `${mmdc} -i README.md -o ${tmp}/README.md --outputFormat svg ` +
      `--theme neutral --backgroundColor white ` +
      `-p ${puppeteerConfig}`,
    { stdio: 'inherit' },
  );

  // Embed SVGs as base64 data URIs so Puppeteer doesn't need to resolve file paths
  let markdown = readFileSync(`${tmp}/README.md`, 'utf8');
  markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+\.svg)\)/g, (_match, alt, svgPath) => {
    const svgContent = readFileSync(resolve(tmp, svgPath));
    const b64 = svgContent.toString('base64');
    return `![${alt}](data:image/svg+xml;base64,${b64})`;
  });
  writeFileSync(`${tmp}/README-embedded.md`, markdown);

  // Convert to PDF
  execSync(
    `${mdToPdf} ${tmp}/README-embedded.md --launch-options '{"args":["--no-sandbox"]}' --css "h2 { break-before: page; } .fig-caption { text-align: center; font-size: 0.85em; color: #555; font-style: italic; margin-top: 0.25em; }"`,
    { stdio: 'inherit' },
  );
  copyFileSync(`${tmp}/README-embedded.pdf`, 'README.pdf');
  console.log('✅ README.pdf generated');
} finally {
  rmSync(tmp, { recursive: true });
}
