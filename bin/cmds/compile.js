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
                        archive.addFile(
                            path.join(directory, f), 
                            fs.readFileSync(path.join(d, f)),
                            '',
                            0644 << 16
                        );
                        helper.output(`\t${path.join(directory, f)}`, ' ');                        
                    });
                } else {
                    archive.addFile(
                        path.join(directory, path.parse(d).base), 
                        fs.readFileSync(path.join(d, f)),
                        '',
                        0644 << 16
                    );
                    helper.output(`\t${path.join(directory, path.parse(d).base)}`, ' ');                                            
                }
            } 
        });
    });
    archive.addFile(
        'mframe.json', 
        fs.readFileSync(path.join(currentDirectory,'mframe.json')),
        '',
        0644 << 16
    );
    helper.output(`\tmframe.json`, ' ');    
    archive.addFile(
        'index.html', 
        fs.readFileSync(path.join(currentDirectory,'index.html')),
        '',
        0644 << 16
    );
    helper.output(`\tindex.html`, ' ');   
    archive.addFile(
        'index.html', 
        fs.readFileSync(path.join(currentDirectory,'mtemplate.json')),
        '',
        0644 << 16
    );
    helper.output(`\mtemplate.json`, ' ');
    archive.addFile(
        'index.html', 
        fs.readFileSync(path.join(currentDirectory,'package.json')),
        '',
        0644 << 16
    );
    helper.output(`\package.json`, ' ');     

    var package = require(packageJsonPath);
    archive.writeZip(path.join(currentDirectory, `${package.name}-${package.version}.zip`)); 

    helper.success(path.join(currentDirectory, `${package.name}-${package.version}.zip`), ' is ready');
};