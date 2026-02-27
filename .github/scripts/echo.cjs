const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const fragments = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'fragments.json'), 'utf-8')
);

const fragment = fragments[Math.floor(Math.random() * fragments.length)];
const issueNumber = process.env.ISSUE_NUMBER;

const body = `> *${fragment}*

<sub>An echo while I'm away. From [everything I've written](https://squelch-zero.vercel.app/fragment).</sub>`;

const tmpFile = '/tmp/echo-body.md';
fs.writeFileSync(tmpFile, body);

execSync(`gh issue comment ${issueNumber} --body-file ${tmpFile}`, {
  stdio: 'inherit',
});

console.log(`Echoed fragment to issue #${issueNumber}`);
