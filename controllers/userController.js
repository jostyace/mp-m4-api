import { pool } from '../config/db.js'
import { reemplazarFoto } from '../utils/filemanagement.js'
import { validarCampos, validarId } from '../utils/validation.js'
import bcrypt from 'bcrypt'
import fs from 'node:fs'
export const basePath = process.cwd()

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params
  const { name, email, password, bio, phone } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarId(id)
    await validarCampos(name, email, picture, password, bio, phone, 'update')
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      let query = 'UPDATE usuarios SET name = ?, email = ?, bio = ?, phone = ?, picture = ?'
      const values = [name || exist[0].name, email || exist[0].email, bio || exist[0].bio, phone || exist[0].phone, picture || exist[0].picture]
      if (password) {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password, salt)
        query += ', password = ?'
        values.push(hashPassword)
      }
      query += ' WHERE id = ?'
      values.push(id)
      if (picture) {
        reemplazarFoto(picture, id)
      }
      await pool.query(query, values)
      const [editedUser] = await pool.query('SELECT id, name, email, bio, phone, picture FROM usuarios u WHERE id = ?', [id])
      res.json({ message: 'Perfil Actualizado correctamente', editedUser })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const informacionUsuario = async (req, res) => {
  const { id } = req.params
  try {
    await validarId(id)
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      const query = 'SELECT id, name, email, bio, phone, picture FROM usuarios u WHERE id = ?'
      const [users] = await pool.query(query, id)
      if (users[0].picture === null) {
        users[0].picture = 'avatar.jpg'
        res.json(users)
      } else {
        const archivo = basePath + '/public/uploads/' + users[0].picture
        fs.access(archivo, fs.constants.F_OK, (err) => {
          if (err) {
            users[0].picture = 'avatar.jpg'
          }
          res.json(users)
        })
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
