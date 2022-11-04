const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
const startDownloadHLS = require('./downloadM3U8')
const axios = require('axios').default
const { config } = require('dotenv')
config()

const app = express()

app.use(express.json()).use(cors()).use(helmet()).use(compression()).use(morgan('dev'))

app.get('/api', async (req, res) => {
    try {
        const { url } = req.body
        if(!url) res.status(200).json({msg: 'Back funcionando'})
        res.json({ url: `${encodeURIComponent(url)}` })
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/:streamId/:livestreamId', async (req, res) => {

    setTimeout(() => {

        const { streamId, livestreamId } = req.params

        const existFolder = fs.existsSync(path.join(__dirname, `../../../bucket-test-grandest/${livestreamId}`))

        if (!existFolder) fs.mkdirSync(path.join(__dirname, `../../../bucket-test-grandest/${livestreamId}`))

        // const existFolder = fs.existsSync(path.join(__dirname, `${livestreamId}`))

        // if (!existFolder) fs.mkdirSync(path.join(__dirname, `${livestreamId}`))

        startDownloadHLS(streamId, livestreamId)

        
    }, 5000);
    res.status(200).json({ msg: 'Start download stream' })
})

app.listen(4000, () => {
    console.log('server in port 4000')
})  
