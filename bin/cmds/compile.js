'use strict';

const fs = require('fs-extra');
const path = require('path');
const zip = require('adm-zip');
const _ = require('underscore');
const helper = require('./../mtemplate-helper.js');

exports.command = 'compile';

exports.describe = 'Create the template zip file. Please see the documentation and the mtemplate.json file for details.';

exports.builder = undefined;

exports.handler = function(argv) {
    let currentDirectory = process.cwd();
    var packageJsonPath = path.join(currentDirectory, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        helper.error('Could not find packag.ejson. Please run init');
        return;
    }
    
    let mTemplateJsonPath = path.join(currentDirectory, 'mtemplate.json');
    if (!fs.existsSync(mTemplateJsonPath)) {
        helper.error('Could not find mtemplate.zip. Please run init');
        return;
    }

    var mtemplate = require(mTemplateJsonPath);

    helper.output('Creating archive...');

    var archive = new zip();
    _.keys(mtemplate).forEach(directory => {
        mtemplate[directory].forEach(d => {
            if (fs.existsSync(d)) {
                if (fs.lstatSync(d).isDirectory()) {
                    fs.readdirSync(d).forEach(f => {
                        helper.output(path.join(currentDirectory, d, f), ' ');
                        archive.addFile(
                            slash(path.join(directory, f)), 
                            fs.readFileSync(path.join(currentDirectory, d, f)),
                            '',
                            0o644 << 16
                        );
                        helper.output(`\t${slash(path.join(directory, f))}`, ' ');                        
                    });
                } else {
                    archive.addFile(
                        path.join(directory, path.parse(d).base), 
                        fs.readFileSync(path.join(currentDirectory, d, f)),
                        '',
                        0o644 << 16
                    );
                    helper.output(`\t${path.join(directory, path.parse(d).base)}`, ' ');                                            
                }
            } 
        });
    });
    ['mframe.json', 'index.html', 'mtemplate.json', 'package.json'].forEach(f => {
        addFileSimple(archive, currentDirectory, f);
    });
    var packageJson = require(packageJsonPath);
    archive.writeZip(path.join(currentDirectory, `${packageJson.name}-${packageJson.version}.zip`)); 

    helper.success(path.join(currentDirectory, `${packageJson.name}-${packageJson.version}.zip`), ' is ready');
};

function addFileSimple(archive, currentDirectory, file) {
    archive.addFile(
        file, 
        fs.readFileSync(path.join(currentDirectory,file)),
        '',
        0o644 << 16
    );
    helper.output(`\t${file}`, ' ');        
}

function slash(str) {
	var isExtendedLengthPath = /^\\\\\?\\/.test(str);
	var hasNonAscii = /[^\x00-\x80]+/.test(str);

	if (isExtendedLengthPath || hasNonAscii) {
		return str;
	}

	return (str.replace(/\\/g, '/')).substr(1);
};
