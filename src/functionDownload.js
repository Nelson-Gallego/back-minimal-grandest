const fs = require('fs')
const request = require('request')
const path = require('path')


function download(url, isBinary) {	
    
    return new Promise((resolve, reject) => {
        let requestSettings = {
            url: url,
            method: 'GET'
        }
        if (isBinary) requestSettings.encoding = null;
        request(requestSettings, function (error, response, body){
            if (error) {
                reject(error);
            } else {
                let urlres = url.match(/^(.*\/)(.*)$/)
                let basename = urlres[2]
                fs.writeFile( path.join(__dirname, `../../../bucket-test-grandest/${folder}`, basename) , body, (err) => {});
                // fs.writeFile( basename , body, (err) => {});
                resolve(body);
            }
        })		
    })
}

module.exports = download
