const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email })

        //Comprobación de usuario
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' })
        }

        //Creación del nuevo usuario
        usuario = new Usuario(req.body)

        // Hash del password
        const salt = await bcryptjs.genSalt(10)
        usuario.password = await bcryptjs.hash(password, salt)


        await usuario.save()

        // Crear y firmar el JasonWebTocken
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
        res.status(400).send('Hubo un error')
    }
}