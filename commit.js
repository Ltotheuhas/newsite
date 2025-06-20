const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Enter your commit message: ', (msg) => {
  rl.close();
  ['git add .', `git commit -m "${msg}"`, 'git push origin main'].forEach((cmd) => {
    try { execSync(cmd, { stdio: 'inherit' }); }
    catch (err) {
      console.error('Failed to execute:', cmd, '\n', err);
      process.exit(1);
    }
  });
});