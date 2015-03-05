var fs   = require('fs'),
    path = require('path'),
    _    = require('lodash');;


function compile(){

  var inputs   = process.argv,
      iL       = inputs.length,
      files    = inputs.slice(2, iL),
      lastFile = inputs[iL - 1],
      outDir;

  // Check if last arg passed is a directory <- change to use filter

  if (path.extname(lastFile) === '') {
    outDir = lastFile;
    files.pop()
    console.log('Files after pop:', files);
  } else {
    outDir = 'monster-files'
  }

  // Create destination

  fs.mkdir(outDir, function(err){
    if (err && err.code == 'EEXIST'){
      return;
    }
  });


  // Now process ALL the files

  _.forEach(files, function mapper(file){

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

      console.log(outDir, path.basename(process.cwd()) , (process.cwd() !== outDir))
      path.basename(process.cwd()) !== outDir && process.chdir(outDir);

      fs.writeFile(outputTitle, output, function(err){
        if(err) throw err;
        console.log(' Nom nom the data monster has chomped ' + file + '\n\n v   V  \n  ^ ^ \n\n');
      });

    });

  });


}


module.exports = compile();