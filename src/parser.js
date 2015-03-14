var PEG     = require('pegjs'),
    fs      = require('fs'),
    util    = require('util'),
    chomper = require('./interpreter.js');

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString(),
    dmCodes = fs.readFileSync(__dirname + '/ent-ex.dm').toString()
    parser  = PEG.buildParser(grammar),
    ast     = parser.parse(dmCodes);

    // console.log(util.inspect(ast, false, null));

function chomp(ast){
  return chomper(ast);
}



exports.structure = chomp(parser);
exports.parser = parser;