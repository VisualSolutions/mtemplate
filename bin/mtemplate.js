#!/usr/bin/env node

var argv = require('yargs')
    .commandDir('cmds')
    .demand(1)
    .help() 
    .argv;
