const chalk = require('chalk');
const timeformat = require('dateformat');

function preFormatter(title, message, color) {
    var now = new Date();
    if (!message) {
        message = title;
        title = ''; 
    } else {
        message = ' ' + message;
    }

    return chalk.gray(
        chalk.yellow('[') +
        timeformat(now, 'HH:MM:ss') +
        chalk.yellow('] ')) +
        chalk.yellow(title) +
        color(message)
}

exports.output = function(title, message) {
    console.log(
        preFormatter(title, message, chalk.bold)
    );
};

exports.error = function(title, message) {
    console.log(
        preFormatter(title, message, chalk.red.bold)
    );
}

exports.success = function(title, message) {
    console.log(
        preFormatter(title, message, chalk.green.bold)
    );
}