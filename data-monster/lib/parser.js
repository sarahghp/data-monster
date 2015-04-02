var PEG     = require('pegjs'),
    fs      = require('fs'),
    util    = require('util'),
    chomper = require('./interpreter.js').chomper;

var grammar = fs.readFileSync(__dirname + '/grammar.txt').toString(),
    parser;

function build(){
  parser  = PEG.buildParser(grammar);
}


function chomp(file, calledFrom){
  var file = fs.readFileSync(file),
      ast  = parser.parse(file.toString());

  // console.log(util.inspect(ast, false, null, true));
  return chomper(ast);
}


exports.build     = build;
exports.structure = chomp;
exports.parser    = PEG.buildParser(grammar); // for tests