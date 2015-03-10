var PEG = require('pegjs'),
    fs  = require('fs');

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString();

module.exports = PEG.buildParser(grammar);