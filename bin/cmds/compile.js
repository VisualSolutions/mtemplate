'use strict';

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');   
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

    let  packageJson = require(packageJsonPath);
    let output = fs.createWriteStream(path.join(currentDirectory, `${packageJson.name}-${packageJson.version}.zip`));
    let archive = archiver('zip');
    archive.pipe(output);
    
    _.keys(mtemplate).forEach(directory => {
        mtemplate[directory].forEach(d => {
            if (fs.existsSync(d)) {
                if (fs.lstatSync(d).isDirectory()) {
                    fs.readdirSync(d).forEach(f => {
                        helper.output(path.join(currentDirectory, d, f), ' ');
                        archive.append(
                            fs.createReadStream(path.join(currentDirectory, d, f)),
                            {name: slash(path.join(directory, f))} );
                        helper.output(`\t${slash(path.join(directory, f))}`, ' ');                        
                    });
                } else {
                    archive.append(
                            fs.createReadStream(path.join(currentDirectory, d, f)),
                            {name: slash(path.join(directory, path.parse(d).base))} );
                    helper.output(`\t${path.join(directory, path.parse(d).base)}`, ' ');                                            
                }
            } 
        });
    });
    ['mframe.json', 'index.html', 'mtemplate.json', 'package.json'].forEach(f => {
        addFileSimple(archive, currentDirectory, f);
    });

    archive.finalize(); 

    helper.success(path.join(currentDirectory, `${packageJson.name}-${packageJson.version}.zip`), ' is ready');
};

function addFileSimple(archive, currentDirectory, file) {
    archive.append(
        fs.createReadStream(path.join(currentDirectory,file)),
        {name: file}
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
