#! /usr/bin/env node
'use strict';

const path = require('path');
const tabtab = require('tabtab');
const meow = require('meow');

const cli = meow({help: false});

const init = () => {
  const args = cli.input;
  const opts = cli.flags;

  // Parse environment variables to see if we're completing stuff
  const env = tabtab.parseEnv(Object.assign({_: args}, opts), process.env);

  // First, install on `yo completion`
  if (args[0] === 'completion' && !env.complete) {
    return tabtab.install({
      name: 'yo',
      completer: 'yo-complete'
    }).then(() => console.log('Completion installed, make sure to reload your shell'));
  }

  // Complete based on environment variables as parsed by tabtab when we are in
  // plumbing mode
  if (args[0] === 'completion' && env.complete) {
    const yoFlags = [
      '--help',
      '--force',
      '--version',
      '--no-color',
      '--insight',
      '--no-insight',
      '--generators'
    ];

    if (env.last.startsWith('--')) {
      tabtab.log(yoFlags, env);
    } else if (env.last.startsWith('-')) {
      tabtab.log(['-f'], env);
    }
  }
};

// Make sure to run this init function when in plumbing mode with `yo-complete`
// or with tests
if (path.basename(process.argv[1]) === 'yo-complete' ||
    /lib\/completion\/index\.js/.test(process.argv[1])) {
  init();
}

module.exports = init;
