import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { connect } from 'mongoose'
import morgan from 'morgan'
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'

dotenv.config()

//  App variables
if (!process.env.PORT) {
  process.exit(1)
}

const app: Express = express()
const port = process.env.PORT || 3000
const apiUrl = process.env.API_URL

// Middleware
app.use(helmet())
app.use(cors())
// app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

// Routes
app.use(`${apiUrl}/products`, productsRouter)
app.use(`${apiUrl}/categories`, categoriesRouter)

// Database Connection
connect(`${process.env.DATABASE_URL}`)
  .then(() => {
    console.log('[database] Database connection is ready...')
  })
  .catch(err => {
    console.log(err)
  })

// App running
app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})
