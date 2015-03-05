var fs = require('fs');


function compile(){

  var file = process.argv[2],
      word = fs.readFileSync(file);


  // Check that the file is type data-monster

  if (file.slice(-3) !== '.dm'){
    throw "I'm sorry but I can only chomp data-monster (.dm) files";
  }

  var title = file.slice(0, -3),      // remove .dm
    outputTitle = title + '.js';    // add .js


  // Then do things to file

  var output = (function addCat(word){
    return word + 'Cat';
  })(word);

  // Then write out js file

  fs.writeFile(outputTitle, output, function(err){
    if(err) throw err;
    console.log(' Nom nom the data monster has chomped ' + file + '\n\n v   V  \n  ^ ^ \n\n');
  });

}



module.exports = compile();