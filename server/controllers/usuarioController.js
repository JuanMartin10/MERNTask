const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')

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
        // Mensaje de confirmación
        res.json({ msg: 'Usuario creado correctamente' })
    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}