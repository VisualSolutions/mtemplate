const utils = require('util');
const _ = require('underscore');
const helper = require('./../../mtemplate-helper.js');
const mframe = require('./../../../mframe.js').mframe;

exports.command = 'list [options]';

exports.describe = 'Show the components inside mframe.json.';

exports.builder = {
    'c': {
        alias: 'component',
        describe: 'specify the index or name of the component'
    },
    'p': {
        alias: 'parameter',
        describe: 'show all parameters or specify id/name of a parameter to show only those matches'
    },
    'a': {
        alias: 'all',
        describe: 'show all parameters and components',
    }
};

exports.handler = function(argv) {
    let currentDirectory = process.cwd();

    let mframeHandler = new mframe(currentDirectory);
    let mframeJson = mframeHandler.getMframeJson(false);
    if (!_.isObject(mframeJson)) {
        helper.error('Cannot find mframe.json. Please run init.');
        return;
    }

    if (_.isUndefined(argv.component)) {
        showComponents(mframeJson.components, argv.all);
    } else {
        let components = findApproximateMatches(mframeJson.components, argv.component);
        showComponents(components, argv.parameter);        
    }
};

function showComponents(components, parameter) {
    components.forEach((c, i) => {
        let id = c.name || i;
        let params = c.params ? c.params.length : 'malformed';
        helper.output(`[${id}]:`, `${params}`);
        if(!_.isUndefined(parameter) && _.isArray(c.params)) {
            let paramList = [];
            if (parameter !== true) {
                paramList = findApproximateMatches(c.params, parameter);
            } else {
                paramList = c.params;
            }
            showParams(paramList);
        }
    });
}

function showParams(params) {
    if (_.isArray(params) && params.length > 0) {
        params.forEach((p, pid) => {
            let paramId = p.name || pid;
            let type = p.type || 'no type';
            let value =  JSON.stringify(p.value);
            helper.output(`\t[${paramId}]:`, `${type} / ${value}`);
        });
    } else {
        helper.output('\tno matches');
    }
}

function findApproximateMatches(array, what) {
    let youSay = _.isNaN(parseInt(what, 10)) ? what + '' : parseInt(what, 10); 
    let components = [];
    if (!_.isString(youSay) && array.length > youSay) {
        components.push(array[youSay]);
    }
    
    array.filter(c => c.name.toLowerCase().startsWith(youSay.toString().toLowerCase())).forEach(m => {
        components.push(m);
    });

    return components;
}