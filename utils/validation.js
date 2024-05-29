import { eliminarArchivo } from './filemanagement.js'
import { pool } from '../config/db.js'

export async function validarId (id) {
  const parsedId = parseInt(id)
  if (!Number.isInteger(parsedId) || isNaN(parsedId) || parsedId <= 0) {
    throw new Error('ID es inválido')
  }
}

export async function validarCampos (name, email, picture, password, bio, phone, action) {
  const [emailDuplicated] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email])
  if (action === 'create') {
    if (!email || !password) {
      throw new Error('Todos los campos son requeridos')
    }
    if (!isValidEmail(email)) {
      throw new Error('El email es inválido')
    }
    if (emailDuplicated.length !== 0) {
      throw new Error('El email ingresado ya está en uso')
    }
  } else if (action === 'update') {
    if (email && !isValidEmail(email)) {
      eliminarArchivo(picture)
      throw new Error('El email es inválido')
    }
    if (emailDuplicated.length > 1) {
      eliminarArchivo(picture)
      throw new Error('El email ingresado ya está en uso')
    }
    if (bio && bio.length > 255) {
      eliminarArchivo(picture)
      throw new Error('La bio debe tener como máximo 255 caracteres')
    }
    // if (phone || phone.length > 20) {
    //   eliminarArchivo(picture)
    //   throw new Error('El teléfono es Inválido')
    // }
    if (name && name.length > 50) {
      eliminarArchivo(picture)
      throw new Error('El nombre debe tener como máximo 50 caracteres')
    }
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
