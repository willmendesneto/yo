#! /usr/bin/env node
'use strict';

const tabtab = require('tabtab');
const meow = require('meow');
const cli = meow({help: false});
const path = require('path');

const init = () => {
  const args = cli.input;
  const opts = cli.flags;

  // Parse environment variables to see if we're completing stuff
  const env = tabtab.parseEnv(Object.assign({_: args}, opts), process.env);
  // console.log('wtf', env);

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
    } else if (env.prev === 'yo') {
      tabtab.log(['doctor', ...yoFlags], env);

      /* * /
      // TODO: Deal with ':' in generators, broken under bash at least and zsh
      // understand this as description. That's something to fix and figure out
      // in tabtab.

      const yoEnv = require('yeoman-environment').createEnv();
      // Should we complete installed generators ? It is a little bit slow and
      // hangs out the terminal, might be confusing for the user
      yoEnv.lookup(() => {
        const meta = yoEnv.getGeneratorsMeta();
        const generators = Object.keys(meta);
        // console.error(generators);
        tabtab.log(generators, env);
      });
      /* */
    }
  }
};

// Make sure to run this init function when in plumbing mode with `yo-complete`
if (path.basename(process.argv[1]) === 'yo-complete') {
  init();
}

module.exports = init;
