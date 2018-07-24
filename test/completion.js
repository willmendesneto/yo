'use strict';
const path = require('path');
const assert = require('assert');
const {execFile} = require('child_process');

describe('Completion', () => {
  describe('Test completion STDOUT output', () => {
    it('Returns the completion candidates for options', done => {
      const yocomplete = path.join(__dirname, '../lib/completion/index.js');

      let cmd = 'DEBUG="tabtab*" COMP_POINT="4" COMP_LINE="yo --" COMP_CWORD="1" ';
      cmd += `node ${yocomplete} completion -- yo --`;

      // Note: Use third arguments stderr for debugging
      execFile('bash', ['-c', cmd], (err, out, _) => {
        if (err) {
          done(err);
          return;
        }

        assert.ok(/-f/.test(out));
        assert.ok(/--force/.test(out));
        assert.ok(/--version/.test(out));
        assert.ok(/--no-color/.test(out));
        assert.ok(/--no-insight/.test(out));
        assert.ok(/--insight/.test(out));
        assert.ok(/--generators/.test(out));

        done();
      });
    });

    it('Returns the completion candidates for options with single dash', done => {
      const yocomplete = path.join(__dirname, '../lib/completion/index.js');

      let cmd = 'DEBUG="tabtab*" COMP_POINT="4" COMP_LINE="yo -" COMP_CWORD="1" ';
      cmd += `node ${yocomplete} completion -- yo -`;

      // Note: Use third arguments stderr for debugging
      console.log('cmd', cmd);
      execFile('bash', ['-c', cmd], (err, out, _) => {
        if (err) {
          done(err);
          return;
        }

        assert.ok(/-f/.test(out));
        done();
      });
    });
  });
});
