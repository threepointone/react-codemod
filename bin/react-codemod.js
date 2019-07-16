#!/usr/bin/env node

// react-codemod name-of-transform path/to/src

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const meow = require('meow');

const transformerDirectory = path.join(__dirname, '../', 'transforms');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');

const currentDir = process.cwd();
process.chdir(__dirname);

const transforms = fs
  .readdirSync('../transforms')
  .filter(x => x.slice(-3) === '.js')
  .map(x => x.slice(0, -3));

const transform = process.argv[2];
let dest = process.argv[3];
const usage = `npx react-codemod <transform> <path/to/code>\n`;
if (!transform || transforms.indexOf(transform) === -1) {
  console.log(usage);
  console.error(
    'missing/invalid transform name. Pick one of:\n' +
      transforms.map(x => '- ' + x).join('\n')
  );
  process.exit(1);
}
if (!dest) {
  dest = '.';  
}

// const cmd = `npm run jscodeshift -- -t ${path.join(
//   'transforms',
//   transform + '.js'
// )} ${path.join(
//   currentDir,
//   dest
// )} --verbose=2 --ignore-pattern=**/node_modules/** ${[...process.argv]
//   .slice(4)
//   .join(' ')}`;
// console.log('running', cmd);

let args = ['-t', path.join(transformerDirectory, transform + '.js')].concat(
  path.join(currentDir, dest)
);

// const { dry } = flags;

// if (dry) {
//     args.push('--dry');
// }

args.push('--ignore-pattern', '**/node_modules/**');
args.push('--parser', 'flow');
// args.push('--verbose', '2');

// args.push('--parser', parser);
// if (parser === 'tsx') {
//     args.push('--extensions=tsx,ts');
// }

// if (transformerArgs && transformerArgs.length > 0) {
//     args = args.concat(transformerArgs);
// }

const result = execa.sync(jscodeshiftExecutable, args, {
  stdio: 'inherit',
  stripEof: false
});

if (result.error) {
  throw result.error;
}
// childProcess.execSync(cmd);


// ask for a parser 
// confirm all choices in plain english before running (or just exit/start from beginning)