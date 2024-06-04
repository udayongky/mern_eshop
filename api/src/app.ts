import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { connect } from 'mongoose'
import morgan from 'morgan'
import categoriesRoutes from './routes/categories.js'
import productsRoutes from './routes/products.js'
import usersRoutes from './routes/users.js'
import errorHandler from './utils/error-handler.js'
import authJwt from './utils/jwt.js'
// import ordersRoutes from './routes/orders.js'

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
app.use(authJwt())
app.use(errorHandler)

// Routes
app.use(`${apiUrl}/categories`, categoriesRoutes)
app.use(`${apiUrl}/products`, productsRoutes)
app.use(`${apiUrl}/users`, usersRoutes)
// app.use(`${apiUrl}/orders`, ordersRoutes)

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
