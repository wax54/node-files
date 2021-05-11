const fs = require('fs');
const axios = require('axios');

const OUTPUT_FILE_FLAG = 'out';
const flags = {};

start(process.argv);

async function start(args){
    //get the inputs and sets the flags
    const inputs = handleInput(args);

    const promises = [];
    for (let input of inputs){
        promises.push(getDataPromiseFor(input));
    }

    for(let promise of promises){
        try{
            const data = await promise;
            if (flags[OUTPUT_FILE_FLAG]) {
                //append the result to the output file
                try {
                    await writeToFile(flags[OUTPUT_FILE_FLAG], data);
                } catch (e) {
                    console.error(e);
                }
            } else {
                console.log(data);
            }
        }
        catch(e){
            console.error(e);
        }
        
    }
    // process.exit(0);
}

async function getDataPromiseFor(path){
    let dataPromise;

    if (isValidUrl(path)) dataPromise = webCat(path);
    else dataPromise = cat(path);
    
    return dataPromise;
}


function cat(filepath) {
    return new Promise(function(resolve, reject){
        fs.readFile(`${filepath}`, 'utf8', (err, text) => {
            if (err) {

                const errorString = "Error finding data for " + filepath + "\n";
                reject(errorString);
            } else {
                resolve(text);
            }
        });
    });
}

async function webCat(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        let error = `Error Fetching ${err.config.url}\n`;
        if (err.response)
            error += `Request failed with status code ${err.response.status}`;
        throw error;
    }
}



function writeToFile(filepath, data) {
    return new Promise(function (resolve, reject){
        fs.writeFile(`${filepath}`, "\n"+data, { encoding: 'utf8', flag: 'a' }, (err) => {
            if (err) {
                reject("ERROR WRITING TO FILE" + filepath);
            }
            resolve();
        });
    });
}



/**
 * 
 * @param { String } string the string to be tested
 * @returns { boolean } whether or not the string was a URL with a HTTP or HTTPS protocol
 */
function isValidUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
        return false;
    }
}


function handleInput(args) {
    const inputFiles = [];
    for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const flag = args[i].split('--')[1];
            if (flag == OUTPUT_FILE_FLAG) {
                //get to the next arg
                i++;
                //save the file path as the value for the flag
                flags[flag] = args[i];
            }
        }
        else {
            inputFiles.push(args[i]);
        }
    }
    return inputFiles;
}


module.exports = {
OUTPUT_FILE_FLAG,
flags,
start,
handleInput,
getDataPromiseFor,
cat,
webCat,
writeToFile,
isValidUrl
};