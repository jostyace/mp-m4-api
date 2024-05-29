import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/usuariosRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { PORT } from './config/config.js'
import { swaggerDocs } from './config/swagger.js'

const app = express()

app.use(express.static('public'))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
swaggerDocs(app, PORT)
app.use('/api', usuariosRoutes, authRoutes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT)
})
