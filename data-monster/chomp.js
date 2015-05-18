#!/usr/bin/env node

var fs       = require('fs'),
    path     = require('path'),
    _        = require('lodash'),
    parser   = require('./lib/parser.js'),
    writer   = require('./lib/writer.js'),
    flags    = writer.flags;


function compiler(){

  var inputs      = process.argv,
      iL          = inputs.length,
      files       = inputs.slice(2, iL),
      lastFile    = inputs[iL - 1],
      outDir;

  // Checks if last arg passed is a directory <-- CHANGE TO FLAG `-d /path/to/files`

  function createDirectory(check){
    if (path.extname(check) === '' && path.basename(check) !== '-a') {
      outDir = check;
      files.pop();
    } else {
      outDir = __dirname + '/monster-files';
    }

    // Create destination, using recommended handling of ignoring 'EEXIST' error  
    // since fs.exists() will be deprecated

    fs.mkdir(outDir, function(err){
      if (err && err.code == 'EEXIST'){
        return;
      } else if (err) {
        console.log(err);
      }
    });
  }

  // Checks for -a flag and generates files array if necessary <-- use minimst


  // Review with Alan — this is confusing
  function buildFileArray(filter, list, arr){
    var arr     = arr || [],
        file    = list.pop();

    (path.extname(file) === filter) && arr.push(file); // just use lodash filter, silly; take in files, filter, return

    if (list.length > 0){
      return buildFileArray(filter, list, arr);
    } else {
      return arr;
    }
  }

  function genFileCollection(dir){
    if (files[0] === '-a'){
      return buildFileArray('.dm', fs.readdirSync(dir)); // <-- why is filter hardcoded here?
    } else {
      return files;
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

  createDirectory(lastFile);
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