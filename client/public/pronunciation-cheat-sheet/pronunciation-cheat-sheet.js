const errorEl = document.getElementById('error');

function join(value) {
  if (value == null) {
    return '';
  }
  return Array.isArray(value) ? value.join(', ') : String(value);
}

function paragraphs(parent, lines) {
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    parent.append(p);
  }
}

function table(headers, rows) {
  const tableEl = document.createElement('table');
  const head = document.createElement('tr');
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    head.append(th);
  }
  tableEl.append(head);
  for (const row of rows) {
    const tr = document.createElement('tr');
    row.forEach((value, index) => {
      const td = document.createElement('td');
      if (value instanceof Node) {
        td.append(value);
      } else {
        td.textContent = value;
      }
      if (headers[index] === 'Thai') {
        td.className = 'thai';
      }
      if (headers[index] === 'IPA' || headers[index] === 'IPA syllables') {
        td.classList.add('ipa');
      }
      tr.append(td);
    });
    tableEl.append(tr);
  }
  return tableEl;
}

function parserCells(analysis) {
  return [
    join(analysis.syllables && analysis.syllables.ssg),
    join(analysis.syllables && analysis.syllables.tltk),
    join(analysis.ipa),
    join(analysis.ipaSyllables),
    join(analysis.pronunciate),
    join(analysis.romanize && analysis.romanize.royin),
    join(analysis.romanize && analysis.romanize.ssg),
    join(analysis.romanize && analysis.romanize.w2p),
    join(analysis.soundex && analysis.soundex.udom83),
    join(analysis.soundex && analysis.soundex.lk82),
    join(analysis.soundex && analysis.soundex.metasound),
  ];
}

const parserHeaders = [
  'ssg',
  'tltk',
  'IPA',
  'IPA syllables',
  'Pronunciate',
  'Romanize',
  'Romanize ssg',
  'Romanize w2p',
  'udom83',
  'lk82',
  'metasound',
];

function audioCell(item) {
  const audio = item.audio;
  if (!audio) {
    return '';
  }
  const wrap = document.createElement('div');
  wrap.className = 'clip';
  const player = document.createElement('audio');
  player.controls = true;
  player.preload = 'none';
  player.src = audio.url;
  const link = document.createElement('a');
  link.href = audio.url;
  const gender = audio.ssmlGender === 'FEMALE' ? 'Female' : 'Male';
  link.textContent = `${gender} voice`;
  wrap.append(player, link);
  return wrap;
}

function soundLabel(item) {
  return [item.sound, item.label].filter(Boolean).join(' ');
}

function mount(id, node) {
  document.getElementById(id).replaceChildren(node);
}

function render(sheet) {
  paragraphs(document.getElementById('intro'), sheet.intro);
  mount(
    'words',
    table(
      ['Thai', 'Audio', 'Meaning', 'Covers', ...parserHeaders],
      sheet.words.map((item) => [
        item.thai,
        audioCell(item),
        item.meaning,
        item.covers,
        ...parserCells(item.analysis),
      ]),
    ),
  );
  document.getElementById('missing').textContent =
    `${sheet.missingVowel.note} Spelling pattern: ${sheet.missingVowel.spelling}.`;
  document.getElementById('inventory-intro').textContent = sheet.inventoryIntro;
  mount(
    'initials',
    table(
      ['Sound', 'Word'],
      sheet.initials.map((item) => [soundLabel(item), item.word]),
    ),
  );
  mount(
    'finals',
    table(
      ['Sound', 'Word'],
      sheet.finals.map((item) => [soundLabel(item), item.word]),
    ),
  );
  mount(
    'vowels',
    table(
      ['Sound', 'Word'],
      sheet.vowels.map((item) => [soundLabel(item), item.word || 'missing']),
    ),
  );
  mount(
    'tones',
    table(
      ['Tone', 'Word'],
      sheet.tones.map((item) => [item.tone, item.word]),
    ),
  );
  paragraphs(document.getElementById('particles-intro'), sheet.particlesIntro);
  mount(
    'particles',
    table(
      ['Thai', 'Audio', 'Closes', ...parserHeaders],
      sheet.particles.map((item) => [
        item.thai,
        audioCell(item),
        item.closes,
        ...parserCells(item.analysis),
      ]),
    ),
  );
}

fetch('./sheet.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`cheat sheet request failed (${response.status})`);
    }
    return response.json();
  })
  .then(render)
  .catch((err) => {
    errorEl.hidden = false;
    errorEl.textContent = err instanceof Error ? err.message : String(err);
  });
