#!/usr/bin/env node
/**
 * Parse exam-mentions-clean.md into database-exam-mentions.json
 * Usage: node scripts/parse-exam-mentions.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const inputPath = path.join(__dirname, '../writeup-and-notes/exam-mentions-clean.md');
const outputPath = path.join(__dirname, '../databases/database-exam-mentions.json');

const raw = fs.readFileSync(inputPath, 'utf8');

const QUESTION_MARKER = '#### QUESTION X';
const ANSWER_MARKER = '#### ANSWER X';
const END_MARKER = '#### END QUESTION';

const blocks = raw.split(QUESTION_MARKER).filter(Boolean);
const questionsWithAnswers = [];

function hashId(str) {
  return crypto.createHash('md5').update(str.slice(0, 200)).digest('hex');
}

for (const block of blocks) {
  const answerIdx = block.indexOf(ANSWER_MARKER);
  if (answerIdx === -1) continue;

  const questionText = block.slice(0, answerIdx).trim().replace(/\n+/g, ' ').trim();
  let answerBlock = block.slice(answerIdx + ANSWER_MARKER.length);

  // Trim at END QUESTION or next QUESTION X (start of next block content)
  const endIdx = answerBlock.indexOf(END_MARKER);
  const nextQIdx = answerBlock.indexOf(QUESTION_MARKER);
  if (endIdx !== -1) {
    answerBlock = answerBlock.slice(0, endIdx);
  } else if (nextQIdx !== -1) {
    answerBlock = answerBlock.slice(0, nextQIdx);
  }
  const answerText = answerBlock.trim();

  if (!questionText || !answerText) continue;

  questionsWithAnswers.push({
    questionId: hashId(questionText + answerText.slice(0, 100)),
    questionText,
    answerText,
    tags: ['exam-mentions'],
    domains: ['exam'],
  });
}

const db = {
  databaseName: 'Exam Mentions',
  questionsWithAnswers,
};

fs.writeFileSync(outputPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Wrote ${questionsWithAnswers.length} questions to ${outputPath}`);
