const fs = require('fs-extra');
const liveServer = require('live-server');
const path = require('path');
const _ = require('underscore');

exports.command = 'watch';

exports.describe = 'Start live-server on the current directory.';

exports.builder = undefined;

exports.handler = function(argv) {
    var currentDirectory = process.cwd();
    let mTemplateJsonPath = path.join(currentDirectory, 'mtemplate.json');
    if (!fs.existsSync(mTemplateJsonPath)) {
        helper.error('Found no mtemplate.json. Please run init.');
        return;
    }

    var mtemplate = require(mTemplateJsonPath);

    var params = {
        mount: []
    };

    params.mount = _.keys(mtemplate).map(route => {
        return mtemplate[route].map(path => {
            return [route, path];
        });
    })[0];

    liveServer.start(params);
};