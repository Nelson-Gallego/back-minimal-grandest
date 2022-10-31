const request = require('request')
const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const { config } = require('dotenv')
config()

function download(url, isBinary, folder) {
    return new Promise((resolve, reject) => {
        let requestSettings = {
            url: url,
            method: "GET"
        }
        if (isBinary) requestSettings.encoding = null
        request(requestSettings, function(error, response, body) {
            if (error) {
                reject(error)
            } else {
                let urlres = url.match(/^(.*\/)(.*)$/)
                let basename = urlres[2]
                // fs.writeFile(basename, body, (err) => {})
                fs.writeFile(path.join(__dirname, `../../../bucket-test-grandest/${folder}`, basename), body, (err) => { })
                resolve(body)
            }
        })
    })
}

let parallel = 5

async function startDownloadHLS(streamId, livestreamId) {

    try {
        const urlStream = "https://phenixrts.com/video/grandest.corp/" + encodeURIComponent(streamId) + "/vod.m3u8"

        const url = urlStream

        const urlres = url.match(/^(.*\/)(.*)$/)

        let pathname = urlres[1]

        let body = await download(url, undefined, livestreamId).catch(err => console.log(err))

        let resolutions = body.match(/^.*\.m3u8$/mg)
        for (var res = 0;res < resolutions.length;res++) {
            let resolution = resolutions[res]
            let body = await download(pathname + resolution, undefined, livestreamId).catch(err => console.log(err))

            let downloads = []
            let tsfiles = body.match(/^.*\.ts$/mg)
            for (var ts = 0;ts < tsfiles.length;ts++) {
                let tsfile = tsfiles[ts]
                console.log(pathname + tsfile)
                downloads.push(download(pathname + tsfile, "binary", livestreamId))
                if (downloads.length >= parallel) {
                    await Promise.all(downloads).then(() => { })
                    downloads = []
                }
            }
        }

        const tokenTemp = process.env.TOKEN_APP

        await axios.put(`https://prod-api.grandest.tk/api/v1/livestreams/streamAvailable/${livestreamId}`, {
            urlS3: `https://bucket-test-grandest.s3.amazonaws.com/${livestreamId}/vod.m3u8`
        }, {
            headers: {
                Authorization: `Bearer ${tokenTemp}`
            }
        })

    } catch (e) {
        console.log(e)
    }
}

module.exports = startDownloadHLS
