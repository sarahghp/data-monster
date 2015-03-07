var fs   = require('fs'),
    path = require('path'),
    _    = require('lodash');;


function compile(){

  var inputs   = process.argv,
      iL       = inputs.length,
      files    = inputs.slice(2, iL),
      lastFile = inputs[iL - 1],
      outDir;

  // Checks if last arg passed is a directory

  function createDirectory(check){ 
    if (path.extname(check) === '' && path.basename(check) !== '-a') {
      outDir = check;
      files.pop();
    } else {
      outDir = 'monster-files';
    }

    // Create destination, using recommended handling of ignoring 'EEXIST' error  
    // since fs.exists() will be deprecated

    fs.mkdir(outDir, function(err){
      if (err && err.code == 'EEXIST'){
        return;
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

  // What it is we want to do to the files — this is where the interpreter will be called eventaully

  var changes =  function(files){
    return _.forEach(files, function mapper(file){

      // Check that the file is type data-monster

      if (path.extname(file) !== '.dm'){
        throw "I'm sorry but I can only chomp data-monster (.dm) files";
      }

      // otherwise remove .dm, add .js

      var title = file.slice(0, -3),   
        outputTitle = title + '.js'; 


      // Then do things to file

      fs.readFile(file, function wordBack(err, data){
        
        if (err) throw err;

        var output = (function addCat(word){
          return word + 'Cat';
        })(data);

        // Then write out js file(s) to output directory

        path.basename(process.cwd()) !== outDir && process.chdir(outDir);

        fs.writeFile(outputTitle, output, function(err){
          if(err) throw err;
          console.log(' Nom nom the data monster has chomped ' + file + '\n\n v   V  \n  ^ ^ \n\n');
        });
      });
    });
  }


  // Call all the processes, including final compilation once the event loop has cleared

  createDirectory(lastFile);
  _.defer(changes, genFileCollection(process.cwd()));
}


module.exports = compile();