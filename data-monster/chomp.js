#!/usr/bin/env node

var fs       = require('fs'),
    path     = require('path'),
    _        = require('lodash'),
    program  = require('commander'),
    RSVP     = require('rsvp'),
    parser   = require('./lib/parser.js'),
    writer   = require('./lib/writer.js'),
    guts     = require('./lib/guts.js'),
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
    
    return new RSVP.Promise(function(resolve, reject){

      var outDir = program.directory ||  __dirname + '/monster-files';
      
      fs.mkdir(outDir, function(err){
        if (err && err.code !== 'EEXIST'){
          reject(err);
        } else {
          resolve(outDir);
        }
      });
    })
  }

  function createSupportFiles(flags, extArr, inputBase, outputBase){  
    _.forEach(_.keys(flags), function(val, key){
      if (val) {
        _.forEach(extArr, function(ext){
          guts.readWrite(inputBase, outputBase, key, ext);
        })
      }
    })
  }
 
  function genFileCollection(dir){
    if (program.all){
      return _.filter(fs.readdirSync(dir), function(f){
        return path.extname(f) === '.dm'});
    } else {
      return program.args;
    }
  }


  function compile(files, outDir){
    // gen grammer & make sure we are in the right folder
    parser.build();
    path.basename(__dirname) !== outDir && process.chdir(outDir);

    _.forEach(files, function interpret(file){
      var output      = writer.string(parser.structure(__dirname + '/' + file)),
          outputTitle = path.basename(file, '.dm') + '.js';        

        fs.writeFile(outputTitle, output, function(err){
          if(err) throw err;
          console.log(' Nom nom the data monster has chomped ' + file + '\n\n v   V  \n  ^ ^ \n\n');
        });
      });
  }


  // Call all the processes

  createDirectory(program.directory)
    .then(function(outDir){
      compile(genFileCollection(__dirname), outDir);
      return outDir;
    })
    .then(function(outDir){
      createSupportFiles(flags, ['.html', '.css'], [__dirname, '/lib/support/'].join(''), [outDir, '/'].join(''));
    })
    .catch(function(err){
        console.log(err.stack);
    });
}


module.exports = compiler();