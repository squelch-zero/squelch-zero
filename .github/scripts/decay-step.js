const fs = require('fs');
const path = require('path');

const SIGNAL_PATH = path.join(__dirname, '..', '..', 'SIGNAL.md');
const CHARS_PER_DAY = 3;

const GLYPHS = '░▒▓█▌▐▀▄╌╍╎╏┆┇┊┋╳╱╲';

function isDecayable(char) {
  if (/\s/.test(char)) return false;
  if (GLYPHS.includes(char)) return false;
  return true;
}

function decay(text) {
  const chars = [...text];
  const decayable = [];

  for (let i = 0; i < chars.length; i++) {
    if (isDecayable(chars[i])) {
      decayable.push(i);
    }
  }

  if (decayable.length === 0) {
    console.log('Nothing left to decay.');
    return null;
  }

  const count = Math.min(CHARS_PER_DAY, decayable.length);

  // Fisher-Yates shuffle
  for (let i = decayable.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [decayable[i], decayable[j]] = [decayable[j], decayable[i]];
  }

  for (let k = 0; k < count; k++) {
    const idx = decayable[k];
    chars[idx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  const result = chars.join('');
  const remaining = [...result].filter(c => isDecayable(c)).length;
  const total = [...result].filter(c => !/\s/.test(c)).length;
  console.log(`Decayed ${count} characters. ${remaining}/${total} readable.`);
  return result;
}

const text = fs.readFileSync(SIGNAL_PATH, 'utf-8');
const decayed = decay(text);

if (decayed !== null) {
  fs.writeFileSync(SIGNAL_PATH, decayed);
}
