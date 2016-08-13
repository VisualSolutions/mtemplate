'use strict';

const helper = require('./../mtemplate-helper.js');

exports.command = 'version';

exports.describe = 'Display current version of mtemplate';

exports.builder = undefined;

exports.handler = function(argv) {
    var packageJson = require('./../../package.json');
    helper.output(`mtemplate version ${packageJson.version}`);
}
