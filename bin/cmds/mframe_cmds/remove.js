const utils = require('util');
const _ = require('underscore');
const helper = require('./../../mtemplate-helper.js');
const mframe = require('./../../../mframe.js').mframe;

exports.command = 'remove <component> [parameter] [options]';

exports.describe = 'Removes <component>. If [parameter] is present, only removes that parameter.';

exports.builder = {
    'f': {
        alias: 'force',
        describe: 'Force remove a component even if it has parameters',
        type: 'boolean'
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
        helper.error('Must provide component.');
        return;
    } else {
        let component = findOrCreateMatch(mframeJson.components, argv.component, { name: argv.component, params: []});

        if (!_.isUndefined(argv.parameter) && component) {
            let param = findOrCreateMatch(component.params, argv.parameter, { name: argv.parameter, type: argv.type, value: argv.value });
            if (param) {
                component.params.splice(component.params.indexOf(param), 1);
                helper.output('Removing parameter...');
            }
        } else {
            if (component.params.length > 0 && argv.force) {
                mframeJson.components.splice(mframeJson.components.indexOf(component), 1);
                helper.output(`Removing component with ${component.params.length} parameters...`);
            } else {
                helper.error(`Component has ${component.params.length} parameters. Remove all of them or use --force.`);
                return;
            }
        }

        mframeHandler.save(mframeJson);
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
            let value = p.value || 'undefined';
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

function findOrCreateMatch(array, what, def) {
    let components = findApproximateMatches(array, what);    
    if (!_.isArray(components) || components.length > 1) {
        helper.error('Could not match component or parameter to query. Please use list to find what you\'re looking for.');
        return;
    }

    if (components.length === 0) {
        helper.output(`Could not find "${what}"...`);
        return null;
    } else {
        helper.output(`Found item "${components[0].name}"...`);
        return components[0];            
    }
}