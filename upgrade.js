const fs = require('fs');
const execSync = require('child_process').execSync;

let exec = function(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}


exec('node node_modules/@angular/cli/bin/ng update @angular/core@13 @angular/cli@13');
exec('npm install @firestitch/component-tools@^13.0.2 --save-dev');
exec('git add .');
exec('git commit --message="Angular 13 Upgrade"');
exec('node node_modules/@angular/cli/bin/ng update @angular/material@13 --force');
exec('npm install typescript@4.6.4');
exec('git add .');
exec('git commit --message="Angular Material 13 Upgrade"');

exec('npm run package');
exec('git push -u origin HEAD');