import swaggerAutogen from 'swagger-autogen'
import path from 'path'

const outputFile = path.join(process.cwd(), '../utils/swagger_output.json')
const endpointsFiles = ['../routes/usuariosRoutes.js', '../routes/authRoutes.js']

const generateSwagger = async () => {
  const autogen = swaggerAutogen()
  await autogen(outputFile, endpointsFiles)
  console.log('Swagger documentation generada!')
}

generateSwagger()
