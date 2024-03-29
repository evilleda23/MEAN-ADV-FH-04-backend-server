const { response } = require('express');
const bcrypt = require('bcryptjs');

const {Usuario} = require('../models');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Credenciales incorrectas - Email',
      });
    }

    //Verificar email

    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword)
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales incorrectas - Password',
      });

    //generar token
    const token = await generarJWT(usuarioDB.id);
    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }
    await usuario.save();
    const token = await generarJWT(usuario.id);
    return res.json({
      ok: true,
      user: {
        email,
        name,
        picture,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'El token de google no es correcto',
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  console.log(uid)
  //generar token
  const token = await generarJWT(uid);
  res.json({
    ok: true,
    token
  });
};
module.exports = {
  login,
  googleSignIn,
  renewToken,
};
