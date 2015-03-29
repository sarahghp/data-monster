var PEG     = require('pegjs'),
    fs      = require('fs'),
    util    = require('util'),
    chomper = require('./interpreter.js').chomper;

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString(),
    // dmCodes = fs.readFileSync(__dirname + '/ent-ex.dm').toString(),
    parser;
    // ast     = parser.parse(dmCodes);

    // console.log(util.inspect(ast, false, null, true));

function build(){
  parser  = PEG.buildParser(grammar);
}


function chomp(file){
  var file = fs.readFileSync(__dirname + '/' + file),
      ast  = parser.parse(file.toString());
  return chomper(ast);
}

// This needs to take in a file, build a grammar (let's figure uot how to do that just once)
// parse the file and export that as structure that writer can call on each

exports.build     = build;
exports.structure = chomp;
exports.parser    = PEG.buildParser(grammar); // for tests