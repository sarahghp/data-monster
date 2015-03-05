var fs = require('fs');


function compile(){

  var file = process.argv[2],
      word = fs.readFileSync(file),
      title = file.slice(0, -3),
      outputTitle = title + '.js';

  var output = (function addCat(word){
    return word + 'Cat';
  })(word);

  fs.writeFile(outputTitle, output, function(err){
    if(err) throw err;
    console.log('Completed');
  });

}



module.exports = compile();