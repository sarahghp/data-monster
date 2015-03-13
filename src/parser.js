var PEG = require('pegjs'),
    fs  = require('fs');

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString();

exports.test = PEG.buildParser(grammar);