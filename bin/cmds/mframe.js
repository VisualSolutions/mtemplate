'use strict';

exports.command = 'mframe <command>';

exports.describe = 'View or alter the mframe.json components and parameters.';

exports.builder = function(yargs) {
    return yargs
        .commandDir('mframe_cmds');
}

exports.handler = function(argv) {};