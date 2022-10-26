const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')

const app = express()

app.use(express.json()).use(cors()).use(helmet()).use(compression()).use(morgan('dev'))

app.get('/api', (req, res) => {
    res.json({
        msg: 'all good :)'
    })
})

app.listen(3000, () => {
    console.log('server in port 3000')
})  
