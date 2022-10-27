const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
const download = require('./functionDownload')


const app = express()

app.use(express.json()).use(cors()).use(helmet()).use(compression()).use(morgan('dev'))

app.get('/api/:livestreamId/:streamId', async (req, res) => {

    const { livestreamId, streamId } = req.params

    const folder = livestreamId
    fs.mkdirSync(path.join(__dirname, `../../../bucket-test-grandest/${folder}`))

    
    let parallel = 5;
    
    // https://phenixrts.com/video/grandest.corp/southamerica-east%23sa-saopaulo-1-ad-1.hduF7wk9.20220920.PSdbNrWt/vod.m3u8
    
    async function main(streamId) {
        console.log("🚀 ~ file: index.js ~ line 28 ~ main ~ streamId", streamId)
        // if (process.argv.length < 3) {
        //     console.log("ERROR")
        //     process.exit(1);
        // }
    
        // if (process.argv.length >= 4) {
        //     parallel = process.argv[3]*1;
        // }
    
        // let url = process.argv[2];
        const url = streamId
    
        let urlres = url.match(/^(.*\/)(.*)$/)
        
    
        let pathname = urlres[1]
        
    
        let body = await download(url).catch(err => console.log(err));
        
    
        let resolutions = body.match(/^.*\.m3u8$/mg)
        for(var res=0; res<resolutions.length; res++) {
            let resolution = resolutions[res];
            let body = await download(pathname + resolution).catch(err => console.log(err))
    
            let downloads = [];
            let tsfiles = body.match(/^.*\.ts$/mg)
            for(var ts=0; ts<tsfiles.length; ts++) {
                let tsfile = tsfiles[ts]
                console.log(pathname + tsfile)
                downloads.push(download(pathname + tsfile, "binary"))
                if (downloads.length >= parallel) {
                    await Promise.all(downloads).then(() => {})
                    downloads = [];
                }
            }
        }
    }
    
    // main('https://phenixrts.com/video/grandest.corp/' + encodeURIComponent(streamId) + '/vod.m3u8');
    main('https://phenixrts.com/video/grandest.corp/us-northeast%23us-ashburn-ad-2.wNEq0bdZ.20221020.PSzwzsXD/vod.m3u8')
    

    res.json({ msg: `https://bucket-test-grandest.s3.amazonaws.com/${livestreamId}/vod.m3u8` })
})

app.listen(3000, () => {
    console.log('server in port 3000')
})  
