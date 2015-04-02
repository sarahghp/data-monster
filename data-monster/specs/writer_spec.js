var parserLib = require('../lib/parser.js');
    parser    = parserLib.parser,
    structure = require('../lib/parser.js').structure;

parserLib.build();

var builtStruct = structure(__dirname + '/ent-ex.dm'),
    writer      = require('../lib/writer.js').string(builtStruct);

describe('the writer', function(){
  it('returns a string', function(){
    expect(writer).toEqual(jasmine.any(String));
  });
});