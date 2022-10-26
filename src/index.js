const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')

// const m3u8ToMp4 = require("m3u8-to-mp4");
// const converter = new m3u8ToMp4();

const app = express()

app.use(express.json()).use(cors()).use(helmet()).use(compression()).use(morgan('dev'))

// converter
// .setInputFile('https://phenixrts.com/video/grandest.corp/us-west%23us-west1-c.da8lUcVf.20221004.PSCk5VkF/vod.m3u8')
// .setInputFile(__dirname)
// .start()

console.log(path.join(__dirname))

app.get('/api', (req, res) => {
    res.json({ 
        msg: 'all good :)'
    })
})

app.listen(3000, () => {
    console.log('server in port 3000')
})  
