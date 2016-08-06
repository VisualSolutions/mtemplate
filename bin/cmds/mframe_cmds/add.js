const utils = require('util');
const _ = require('underscore');
const helper = require('./../../mtemplate-helper.js');
const mframe = new (require('./../../../mframe.js').mframe)(process.cwd());

exports.command = 'add <component> [parameter] [options]';

exports.describe = 'Creates <component> if does not already exist. Adds [parameter] to component.';

exports.builder = {
    't': {
        alias: 'type',
        describe: 'Type of the parameter.',
        choices: _.keys(mframe.paramTypeDescription),
        default: 'string'
    }
};

exports.handler = function(argv) {
    let mframeJson = mframe.getMframeJson(false);
    if (!_.isObject(mframeJson)) {
        helper.error('Cannot find mframe.json. Please run init.');
        return;
    }

    if (_.isUndefined(argv.component)) {
        helper.error('Must provide component.');
        return;
    } else {
        let component = findOrCreateMatch(mframeJson.components, argv.component, {
            name: argv.component,
            label: {
                'en-US': {
                    value: argv.component,
                    tooltip: 'Automatically generated default label.'
                }
            },
            params: []
        });

        if (!_.isUndefined(argv.parameter)) {
            findOrCreateMatch(component.params, argv.parameter, createParam(argv.parameter, argv.type));
        }

        mframe.save(mframeJson);
    }
};

function showComponents(components, parameter) {
    components.forEach((c, i) => {
        let id = c.name || i;
        let params = c.params ? c.params.length : 'malformed';
        helper.output(`[${id}]:`, `${params}`);
        if (!_.isUndefined(parameter) && _.isArray(c.params)) {
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
        helper.output(`Creating item "${what}"...`);
        array.push(def);
        return def;
    } else {
        helper.output(`Found item "${components[0].name}", skipping...`);
        return components[0];
    }
}

function createParam(name, type) {
    var param = Object.assign({
            name: name,
            label: {
                'en-US': {
                    value: name,
                    tooltip: 'Automatically generated default label.'
                }
            }
        }, 
        JSON.parse(JSON.stringify(mframe.paramTypeDescription[type]))
    );
    return param;
}