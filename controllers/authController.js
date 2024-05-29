import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'
import { validarCampos } from '../utils/validation.js'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/config.js'
export const basePath = process.cwd()

export const registrarUsuario = async (req, res) => {
  const { email, password } = req.body
  try {
    await validarCampos('', email, '', password, '', '', 'create')
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPassword = await bcrypt.hash(password, salt)
    const query = 'INSERT INTO usuarios (email, password) VALUES (?,?)'
    const [user] = await pool.query(query, [email, hashPassword])
    const [newUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [user.insertId]
    )
    res.json({ message: 'Usuario creado correctamente', newUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const iniciarSesion = async (req, res) => {
  const { email, password } = req.body
  try {
    const [user] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
    if (!user || user.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const passwordMatch = await bcrypt.compare(password, user[0].password)
    if (!passwordMatch) {
      console.log('Cerrar Sesion')
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const token = jwt.sign({ userId: user[0].id, username: user[0].nombre_usuario }, jwtSecret, { expiresIn: '1h' })
    res.status(200).json({ token, userId: user[0].id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
