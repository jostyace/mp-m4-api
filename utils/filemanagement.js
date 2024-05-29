import path from 'node:path'
import fs from 'node:fs'
import { pool } from '../config/db.js'
export const basePath = process.cwd()

export function eliminarArchivo (nombre) {
  const archivo = basePath + '/public/uploads/' + nombre
  const aEliminar = path.resolve(archivo)
  fs.access(archivo, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlinkSync(aEliminar)
    }
  })
}

export async function reemplazarFoto (picture, id) {
  const [pic] = await pool.query('SELECT picture FROM usuarios WHERE id = ?', [id])
  if (picture !== pic[0].picture) {
    eliminarArchivo(pic[0].picture)
  }
}
