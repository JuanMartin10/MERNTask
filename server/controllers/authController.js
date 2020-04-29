const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer el usuario y pw
    const { email, password } = req.body

    try {
        //revisa si el usuario está registrado
        let usuario = await Usuario.findOne({ email })
        if (!usuario) {
            res.status(400).json({ msg: 'El usuario no existe' })
        }
        // revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password incorrecto' })
        }
        // si todo es correcto, Crear y firmar el JasonWebTocken
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if (error) throw error

            // Mensaje de confirmación
            res.json({ token })
        })
    } catch (error) {
        console.log(error)
    }

}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({ usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error' })
    }
}