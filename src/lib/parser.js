var PEG     = require('pegjs'),
    fs      = require('fs'),
    util    = require('util'),
    chomper = require('./interpreter.js').chomper;

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString(),
    parser;

    // console.log(util.inspect(ast, false, null, true));

function build(){
  parser  = PEG.buildParser(grammar);
}


function chomp(file, calledFrom){
  var file = fs.readFileSync(file),
      ast  = parser.parse(file.toString());
  return chomper(ast);
}

// This needs to take in a file, build a grammar (let's figure uot how to do that just once)
// parse the file and export that as structure that writer can call on each

exports.build     = build;
exports.structure = chomp;
exports.parser    = PEG.buildParser(grammar); // for tests