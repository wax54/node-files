const fs = require('fs');
const axios = require('axios');
const { stringify } = require('querystring');


const input = process.argv[2];

if (isValidUrl(input)) webCat(input);
else cat(input);


function cat(filepath) {
    fs.readFile(`${filepath}`, 'utf8', (err, text) => {
        if (err) {
            console.log("I could't understand what you said..... ");
            console.log(err);
            process.exit(1);
        } else {
            console.log(text);
        }
    });
}

async function webCat(url){
    try{
        const res = await axios.get(url);
        console.log(res.data);
    }catch(err){
        console.log("Error Fetching" + err.config.url)
        console.log("Request failed with status code "+ err.response.status);
        
    }

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
    }}