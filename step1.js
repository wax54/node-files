const fs = require('fs');

const filename = process.argv[2];
logFromFile(filename);


function logFromFile(filepath){
    fs.readFile(`${filename}`, 'utf8', (err, text) => {
        if (err) {
            console.log("I could't understand what you said..... ");
            console.log(err);
            process.exit(1);
        } else {
            console.log(text);
        }
    });
}
