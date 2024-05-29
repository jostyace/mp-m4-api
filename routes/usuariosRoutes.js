import express from 'express'

import { subirArchivos } from '../config/multer.js'
import {
  actualizarUsuario,
  informacionUsuario
} from '../controllers/userController.js'
import logueadoMiddleware from '../middleware/logueadoMiddleware.js'

const router = express.Router()

/**
 * @openapi
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Actualiza un usuario existente
 *     tags:
 *       - Usuarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado correctamente
 *                 editedUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_usuario:
 *                       type: string
 *                       example: usuario1
 *                     correo_electronico:
 *                       type: string
 *                       example: usuario1@example.com
 *                     rol:
 *                       type: string
 *                       example: Usuario
 *                     imagen_perfil:
 *                       type: string
 *                       format: binary
 *                       example: profile-picture.jpg
 *       400:
 *         description: No existe un usuario con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.patch('/usuarios/:id', logueadoMiddleware, subirArchivos.single('picture'), actualizarUsuario)

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del usuario solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario
 *                   example: 1
 *                 nombre_usuario:
 *                   type: string
 *                   description: Nombre de usuario
 *                   example: usuario1
 *                 correo_electronico:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *                   example: usuario1@example.com
 *                 rol:
 *                   type: string
 *                   description: Nombre del rol del usuario
 *                   example: Administrador
 *                 rol_id:
 *                   type: integer
 *                   description: ID del rol del usuario
 *                   example: 1
 *                 imagen_perfil:
 *                   type: string
 *                   description: Nombre de archivo de imagen de perfil del usuario
 *                   example: avatar.jpg
 *       400:
 *         description: No se encontró un usuario con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/usuarios/:id', logueadoMiddleware, informacionUsuario)

export default router
