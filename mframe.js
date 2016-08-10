'use strict';

const fs = require('fs-extra');
const path = require('path');
const helper = require('./bin/mtemplate-helper.js');
const _ = require('underscore');

exports.mframe = function(currentDirectory) {
    this.currentDirectory = currentDirectory;
    this.paramTypeDescription = {
        'array': {
            type: 'array',
            value: ['one', 'two']
        },
        'bool': {
            type: 'bool',
            value: false
        },
        'color': {
            type: 'color',
            value: '#ffffff'
        },
        'int': {
            type: 'int',
            value: 10
        },
        'intRange': {
            type: 'intRange',
            value: {
                min: 0,
                max: 50
            },
            typeOptions: {
                min: 0,
                max: 100,
                step: 1
            }
        },
        'mediaReference': {
            value: 'path/to/bundle/image.jpg',
            type: 'mediaReference',
            typeOptions: {
                mediaType: 5
            }
        },
        'multiselect': {
            value: {
                'one': true,
                'three': true
            },
            type: 'multiselect',
            typeOptions: {
                values: ['one', 'two', 'three', 'four'],
            }
        },
        'multiselect-btngroup': {
            value: {
                'bold': true
            },
            type:'multiselect',
            typeOptions: {
                renderType: 'btngroup',
                values: ['bold', 'italic', 'underline'],
                icons: {
                    'bold': 'editor-bold',
                    'italic': 'editor-italics',
                    'underline': 'editor-underline'
                }
            }
        },
        'rangedInt': {
            type: 'rangedInt',
            value: 50,
            typeOptions: {
                renderType: 'slider',
                min: 0,
                max: 100,
                step: 0.5
            }
        },
        'select': {
            type: 'select',
            value: 'one',
            typeOptions: {
                values: ['one', 'two']
            }
        },
        'select-btngroup': {
            type: 'select',
            value: 'center',
            typeOptions: {
                renderType: 'btngroup',
                values: ['left', 'center', 'right', 'justify'],
                icons: {
                    'left': 'editor-align-left',
                    'center': 'editor-align-center',
                    'right': 'editor-align-right',
                    'justify': 'editor-align-justify'
                }
            }
        },
        'select-fontSelect': {
            type: 'select',
            value: 'Georgia',
            typeOptions: {
                renderType: 'fontSelect',
                values: ['Arial', 'Courier', 'Georgia', 'Times New Roman', 'Verdanaa']
            }
        },
        'select-fontSize': {
            type: 'select',
            value: '16px',
            typeOptions: {
                renderType: 'fontSize',
                values: ['10px', '16px', '24px', '32px']
            }
        },
        'select-images': {
            type: 'select',
            value: '/path/to/1.jpg',
            typeOptions: {
                renderType: 'images',
                values: [{
                    image: '/path/to/1.jpg',
                    name: 'first option'
                },
                {
                    image: '/path/to/2.jpg',
                    name: 'second option'
                }]
            }
        },
        'select-radio': {
            type: 'select',
            value: 'one',
            typeOptions: {
                renderType: 'radio',
                values: ['one', 'two']
            }
        },
        'string': {
            type: 'string',
            value: 'default'
        }
    };

    this.getMframeJson = function(force) {
            let mframeJsonPath = path.join(currentDirectory, 'mframe.json');
            if (!fs.existsSync(mframeJsonPath)) {
                if (force === true) {
                    helper.output('Found no mframe.json. Creating default file.');
                    fs.writeFileSync(mframeJsonPath, JSON.stringify({
                        components: []
                    }, null, 4));
                    return true;
                }
                return false;
            }

            return require(mframeJsonPath);
        },

        this.save = function(mframeJson) {
            let mframeJsonPath = path.join(currentDirectory, 'mframe.json');
            fs.writeFileSync(mframeJsonPath, JSON.stringify(mframeJson, null, 4));
        }
}