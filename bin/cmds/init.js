"use strict";
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const _ = require("underscore");
const htmlParser = require('htmlparser2');
const mframe = require('./../../mframe.js').mframe;
const helper = require('./../mtemplate-helper.js');

exports.command = 'init';

exports.describe = 'Initialise current folder with the MVision Template prerequisites';

exports.builder = undefined;

exports.handler = function(argv) {
    let currentDirectory = process.cwd();
    
    if (!checkPrerequisites(currentDirectory)) {
        return;
    }

    let errors = checkMframeJson(currentDirectory);
    if (errors > 0) {
        helper.error(`Found ${errors} format errors. Please review them and try again.`);
        return;
    }

    errors = checkIndexHtml(currentDirectory);
    if (errors > 0) {
        helper.error(`Found ${errors} format errors. Please review them and try again.`);
        return;
    }

    createOrUpdateMtemplateJson(currentDirectory);    

    helper.success('Checks ok. You can now add components or parameters, run the live server to test your template or prepare to publish.');
};

function checkPrerequisites(currentDirectory) {
    let packageJsonPath = path.join(currentDirectory, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        helper.error('Please make sure to initialise a node package in the current directory "npm init", then "npm install mtemplate-loader --save".');
        return false;
    } else {
        helper.output('Found package.json...');
    }

    let packageJson = require(packageJsonPath);

    if (!packageJson.dependencies || !packageJson.dependencies['mtemplate-loader']) {
        helper.error('Please make sure to run "npm install template-loader --save"');
        return false;
    } else {
        helper.output('Found template-loader...');        
    }

    return true;
}

function checkMframeJson(currentDirectory) {
    let mframeHandler = new mframe(currentDirectory);
    let mframeJson = mframeHandler.getMframeJson(true);

    if (mframeJson === true) {
        return false;
    }

    helper.output('Found mframe.json. Checking...');    

    if (!mframeJson || !mframeJson.components || !_.isArray(mframeJson.components)) {
        helper.error('The file is not correctly formatted. Please remove mframe.json and run this command again.');
        return false;
    }

    helper.output(`[mframe.json]:`, `${mframeJson.components.length} components...`);
    let errors = 0;

    mframeJson.components.forEach((c, idx) => {
        if (!_.isString(c.name)) {
            ++errors;
            if (c.guid || c.componentId) {
                helper.error(`\t[${idx}]:`, `obsolete format: please start over or remove this component by index.`);
            } else {
                helper.error(`\t[${idx}]:`, `unexpected format: please start over or remove this component by index.`)
            }
        } else {
            if (!c.params || !_.isArray(c.params)) {
                helper.error(`\t[${idx}]:`, `found component ${c.name} but with no or bad params; please verify, fix or remove this component`);
            } else {
                helper.output(`\t[${c.name}]:`, `found ${c.params.length} params...`)
                c.params.forEach((p, pidx) => {
                    if(!_.isString(p.name)) {
                        ++errors;
                        helper.error(`\t\t[${pidx}]:`, `unexpected format: please remove this param by index`);
                    } else {
                        //TODO: check for types?
                        helper.output(`\t\t[${p.name}]:`, `of type ${p.type}`);
                    }
                });
            }
        }
    });

    return errors;
}

function checkIndexHtml(currentDirectory) {
    let indexPath = path.join(currentDirectory, 'index.html');
    if (!fs.existsSync(indexPath)) {
        helper.output('Found no index.html. Creating default file.');
        let defaultIndexPath = path.join(currentDirectory, 'node_modules', 'mtemplate-loader', 'release', 'index.html');
        fs.copySync(defaultIndexPath, indexPath);
        return 0;
    }

    helper.output('Found index.html. Checking...');

    let parserResult = {
        hasShim: false,
        hasTemplateLoader: false
    }     
    let parser = new htmlParser.Parser({
        onopentag: function(name, attribs) {
            if (name === "script" && attribs.type === "text/javascript" && attribs.src) {
                if (attribs.src === 'js/es6-shim.min.js') {
                    parserResult.hasShim = true;
                } else if(attribs.src === 'js/template-loader.js') {
                    parserResult.hasTemplateLoader = true;
                }
            }
        }
    }, {decodeEntities: true});
    parser.write(fs.readFileSync(indexPath));
    parser.end();

    let errors = 0;

    if (!parserResult.hasShim) {
        helper.error('\t[index.html]', 'No reference to es6-shim.min.js found. Please add <script src="js/es6-shim.min.js" type="text/javascript"></script>');
        ++errors;
    }
    if (!parserResult.hasTemplateLoader) {
        helper.error('\t[index.html]', 'No reference to template-loader.js found. Please add <script src="js/template-loader.js" type="text/javascript"></script>');
        ++errors;
    }

    if (errors === 0) {
        helper.output('\t[index.html]:', 'Found references to es6-shim and template-loader. Please make sure you are actually using the window.Loader.getComponents() promise to get the data');        
    }

    return errors;
}

function createOrUpdateMtemplateJson(currentDirectory) {
    let mTemplateJsonPath = path.join(currentDirectory, 'mtemplate.json');
    if (!fs.existsSync(mTemplateJsonPath)) {
        helper.output('Found no mtemplate.json. Creating default file.');
        let templateLoaderPath = path.join(currentDirectory, 'node_modules', 'mtemplate-loader', 'release', 'js');
        let mtemplate = {
            '/js': [
                slash(path.relative(currentDirectory, templateLoaderPath)),
                slash(path.relative(currentDirectory, path.join(currentDirectory, 'js')))
            ],
            '/css': [
                slash(path.relative(currentDirectory, path.join(currentDirectory, 'css')))
            ],
            '/fonts': [
                slash(path.relative(currentDirectory, path.join(currentDirectory, 'fonts')))
            ],
            '/images': [
                slash(path.relative(currentDirectory, path.join(currentDirectory, 'images')))
            ]
        };
        fs.writeFileSync(mTemplateJsonPath, JSON.stringify(mtemplate, null, 4));
        return true;
    }

    helper.output('Found mtemplate.json...');    
}

function slash(str) {
	var isExtendedLengthPath = /^\\\\\?\\/.test(str);
	var hasNonAscii = /[^\x00-\x80]+/.test(str);

	if (isExtendedLengthPath || hasNonAscii) {
		return str;
	}

	return str.replace(/\\/g, '/');
};
