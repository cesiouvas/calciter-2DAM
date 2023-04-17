const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const port = 3000
const hostname = '127.0.0.1'

let transactionArr = []

//Servidor http iniciado
/*
const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hol')
})

server.listen(port, hostname, () => {
    console.log('server running at http://${hostname}:${port}')
})
*/

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json({
    type: "*/*"
}))

app.use(cors())

app.set('port', process.env.PORT || 4000)


app.get('/transaction', (req, res) => {
    res.send(JSON.stringify(transactionArr))
})

//Post a la ruta http://localhost:3000
app.post('/transaction', (req, res) => {
    let transaction = req.body
    transactionArr.push(transaction)
    res.send(JSON.stringify('Transaccion guardada'))
    console.log(transactionArr)
})

app.listen(app.get('port'), () => {
    console.log('Ejecutandose en http://localhost:', app.get('port'))
})