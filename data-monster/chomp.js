#!/usr/bin/env node

var fs       = require('fs'),
    path     = require('path'),
    _        = require('lodash'),
    program  = require('commander'),
    parser   = require('./lib/parser.js'),
    writer   = require('./lib/writer.js'),
    flags    = writer.flags;


function compiler(){

  // Parse arguments

  program
    .version('0.0.1')
    .description('Compile your data monster files')
    .option('-a, --all', 'Chomp all .dm files')
    .option('-d, --directory [dir]', 'Write out to this directory')
    .parse(process.argv);

  function createDirectory(directory){

    // Create destination, using recommended handling of ignoring 'EEXIST' error  
    // since fs.exists() will be deprecated
    // 
    
    var outDir = directory ||  __dirname + '/monster-files';

    fs.mkdir(outDir, function(err){
      if (err && err.code == 'EEXIST'){
        return;
      } else if (err) {
        console.log(err);
      }
    });
  }

  // Checks for -a flag and generates files array if necessary 
  function genFileCollection(dir){
    if (program.all){
      return _.filter(fs.readdirSync(dir), function(f){
        return path.extname(f) === '.dm'});
    } else {
      return program.args;
    }
  }

  // What it is we want to do to the files

  var compile =  function(files){  // <-- this is kind of a stupid function name
    // call grammar gen once, then 
    parser.build();

    _.forEach(files, function interpret(file){
      var structure   = parser.structure(__dirname + '/' + file),
          output      = writer.string(structure),
          title       = file.slice(0, -3), // because we know the extname is .dm
          outputTitle = title + '.js';

        // Then write out js file(s) to output directory

        path.basename(process.cwd()) !== outDir && process.chdir(outDir);

        fs.writeFile(outputTitle, output, function(err){
          if(err) throw err;
          console.log(' Nom nom the data monster has chomped ' + file + '\n\n v   V  \n  ^ ^ \n\n');
        });
      });
  }


  // Call all the processes, including final compilation once the event loop has cleared

  createDirectory(program.directory);
  _.defer(compile, genFileCollection(__dirname));

  // Finally add in HTML & CSS helper files if necessary
  _.defer(function(){
    if (flags.ttBool){
      fs.createReadStream(__dirname + '/lib/tt.html').pipe(fs.createWriteStream(outDir + '/tt.html'));
      fs.createReadStream(__dirname + '/lib/tt.css').pipe(fs.createWriteStream(outDir + '/tt.css'));
    }
    if(flags.axisBool){
      fs.createReadStream(__dirname + '/lib/axis.css').pipe(fs.createWriteStream(outDir + '/axis.css'));
    }
  })

}


module.exports = compiler();