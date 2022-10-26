const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')

const download = require("node-hls-downloader").download;

const app = express()

app.use(express.json()).use(cors()).use(helmet()).use(compression()).use(morgan('dev'))

app.get('/api', async (req, res) => {
    console.log(path.join(__dirname))
    // await download({
    //     quality: "best",
    //     concurrency: 5,
    //     outputFile: path.join(__dirname, 'videoo.mp4'),
    //     streamUrl: "https://phenixrts.com/video/grandest.corp/southamerica-east%23sa-saopaulo-1-ad-1.fnvarOMH.20220921.PScd57Lw/vod.m3u8",
    // });

    res.json({ msg: 'all good :)' })
})

app.listen(3000, () => {
    console.log('server in port 3000')
})  
