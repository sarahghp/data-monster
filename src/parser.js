var PEG = require('pegjs'),
    fs  = require('fs'),
    util = require('util');

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString(),
    dmCodes = fs.readFileSync(__dirname + '/ent-ex.dm').toString()
    parser  = PEG.buildParser(grammar),
    ast     = parser.parse(dmCodes);

    console.log(util.inspect(ast, false, null));

// function interpret(ast){

// }



// exports.structure = interpret(parsed);
exports.parser = parser;