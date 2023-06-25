const express = require('express')
const app = express()


app.use(express.json())
app.use('/auth', require('./routes/auth.js'))

app.get('/', (req, res )=>{
    res.json("Welcome to Server")
})

port = 3300
app.listen(port, function (res) {
    console.log(`Server Running on http://localhost:${port}`)
})