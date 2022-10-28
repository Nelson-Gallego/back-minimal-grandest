const request = require('request')
const fs = require('fs')

function download(url, isBinary) {
	return new Promise((resolve, reject) => {
		let requestSettings = {
		    url: url,
		    method: "GET"
		}
		if (isBinary) requestSettings.encoding = null
		request(requestSettings, function (error, response, body){
		    if (error) {
		        reject(error)
		    } else {
				let urlres = url.match(/^(.*\/)(.*)$/)
				let basename = urlres[2]
				// fs.writeFile(basename, body, (err) => {})
                fs.writeFile( path.join(__dirname, `../../../bucket-test-grandest/${folder}`, basename), body, (err) => {})
		    	resolve(body)
		    }
		})		
	})
}

let parallel = 5

async function startDownloadHLS(streamId, livestreamId) {

    const urlStream = "https://phenixrts.com/video/grandest.corp/" + encodeURIComponent(streamId) + "/vod.m3u8"

	let url = urlStream

	let urlres = url.match(/^(.*\/)(.*)$/)

	let pathname = urlres[1]

	let body = await download(url).catch(err => console.log(err))

	let resolutions = body.match(/^.*\.m3u8$/mg)
	for(var res=0; res<resolutions.length; res++) {
		let resolution = resolutions[res]
		let body = await download(pathname + resolution).catch(err => console.log(err))

		let downloads = []
		let tsfiles = body.match(/^.*\.ts$/mg)
		for(var ts=0; ts<tsfiles.length; ts++) {
			let tsfile = tsfiles[ts]
    		console.log(pathname + tsfile)
    		downloads.push(download(pathname + tsfile, "binary"))
    		if (downloads.length >= parallel) {
    			await Promise.all(downloads).then(() => {})
    			downloads = []
    		}
    	}
    }

    console.log('DESCARGA FINALIZADA ', streamId + ' ' + livestreamId)
}

module.exports = startDownloadHLS
