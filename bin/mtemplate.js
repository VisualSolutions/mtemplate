#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: mtemplate <command>')
    .commandDir('cmds')
    .demand(1)
    .help() 
    .argv;
