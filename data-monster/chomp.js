#!/usr/bin/env node

var fs       = require('fs'),
    path     = require('path'),
    _        = require('lodash'),
    parser   = require('./lib/parser.js'),
    writer   = require('./lib/writer.js'),
    flags    = writer.flags;


function compile(){

  var inputs      = process.argv,
      iL          = inputs.length,
      files       = inputs.slice(2, iL),
      lastFile    = inputs[iL - 1],
      calledFrom  = process.cwd(),
      outDir;

  // Checks if last arg passed is a directory

  function createDirectory(check){
    if (path.extname(check) === '' && path.basename(check) !== '-a') {
      outDir = check;
      files.pop();
    } else {
      outDir = calledFrom + '/monster-files';
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

  // Checks for -a flag and generates files array if necessary

  function buildFileArray(filter, list, arr){
    var arr     = arr || [],
        file    = list.pop();

    (path.extname(file) === filter) && arr.push(file);

    if (list.length > 0){
      return buildFileArray('.dm', list, arr);
    } else {
      return arr;
    }
  }

  function genFileCollection(dir){
    if (files[0] === '-a'){
      return buildFileArray('.dm', fs.readdirSync(dir));
    } else {
      return files;
    }
  }

  // What it is we want to do to the files

  var changes =  function(files){
    // call grammar gen once, then 
    parser.build();

    _.forEach(files, function interpret(file){
      var structure   = parser.structure(calledFrom + '/' + file),
          output      = writer.string(structure),
          title       = file.slice(0, -3),
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
  _.defer(changes, genFileCollection(calledFrom));

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


module.exports = compile();