const express = require("express")
const dotenv = require("dotenv")
const routes = require("./routes")
const cors = require('cors')
const { default: mongoose } = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'token'],
    credentials: true,
}))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb" }))

app.use(bodyParser.json())
app.use(cookieParser())

routes(app)




mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log("Connect to database!")
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log("Server is running in port", + port)
})