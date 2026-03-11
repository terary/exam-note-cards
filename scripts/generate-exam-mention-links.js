#!/usr/bin/env node
/**
 * Generate exam-mention-links.md from grep -rin '\bexam\b' writeup-and-notes/1*
 * For each match: 2 lines above, match line, 2 lines below; then link to file.
 * Usage: node scripts/generate-exam-mention-links.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const writeupDir = path.join(__dirname, '../writeup-and-notes');
const outputPath = path.join(__dirname, '../writeup-and-notes/exam-mention-links.md');

// Match writeup-and-notes/1* (files starting with 1). Use shell so glob expands.
const grepCmd = "grep -rin -E '\\bexam\\b' writeup-and-notes/1* 2>/dev/null || true";
const grepOut = execSync(grepCmd, {
  cwd: path.join(__dirname, '..'),
  encoding: 'utf8',
  shell: true,
});

const matches = [];
for (const line of grepOut.split('\n')) {
  if (!line.trim()) continue;
  // Format: path:lineno:content (content may contain colons)
  const idx1 = line.indexOf(':');
  if (idx1 === -1) continue;
  const idx2 = line.indexOf(':', idx1 + 1);
  if (idx2 === -1) continue;
  const filePath = line.slice(0, idx1);
  const lineno = parseInt(line.slice(idx1 + 1, idx2), 10);
  const content = line.slice(idx2 + 1);
  if (!filePath || !lineno || isNaN(lineno)) continue;
  matches.push({ filePath, lineno, content });
}

const sections = [];
for (const { filePath, lineno } of matches) {
  const absPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
  let lines = [];
  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    lines = raw.split(/\r?\n/);
  } catch (e) {
    lines = ['(file not found)'];
  }
  const oneBased = lineno; // grep uses 1-based
  const start = Math.max(0, oneBased - 2 - 1); // 0-based index for line before 2
  const end = Math.min(lines.length, oneBased + 2);   // 0-based end (exclusive) for 2 lines after
  const contextLines = [];
  for (let i = start; i < end; i++) {
    const num = i + 1;
    const text = lines[i] ?? '';
    const isMatch = num === oneBased;
    const prefix = isMatch ? `${num}:` : `${num}-`;
    contextLines.push(prefix + (text === '' ? '' : ' ' + text));
  }
  sections.push({
    context: contextLines.join('\n'),
    linkPath: filePath,
    lineNum: oneBased,
  });
}

const md = [
  '# Exam mention links',
  '',
  'Generated from `grep -rin \\bexam\\b writeup-and-notes/1*` with 2 lines of context above and below each match.',
  '',
  `Total: ${sections.length} mentions.`,
  '',
  '---',
  '',
  ...sections.flatMap((s, i) => [
    `## ${i + 1}. [${path.basename(s.linkPath)}#L${s.lineNum}](${s.linkPath}#L${s.lineNum})`,
    '',
    '```',
    s.context,
    '```',
    '',
    `link: [${s.linkPath}#L${s.lineNum}](${s.linkPath}#L${s.lineNum})`,
    '',
  ]),
].join('\n');

fs.writeFileSync(outputPath, md, 'utf8');
console.log(`Wrote ${sections.length} sections to ${outputPath}`);
